import { useMemo, useState } from "react";
import { Formik, Form, getIn } from "formik";
import { useParams } from "react-router-dom";

import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import DatePickerField from "../../../components/DatePickerField";
import Button from "../../../components/Button";
import FileUploader from "../../../components/FileUploader";

import BankDetailsFields from "../../stores/components/BankDetailsFields";
import OpeningHoursFormSection from "../../stores/components/OpeningHoursFormSection";

import BasicInfoForm from "./BasicInfoForm";
import {
  userEmptyInitialValues,
  userSchema,
  userStepFieldKeys,
} from "../userHelper";
import {
  type UserInfoTypes,
  type CreateUsersDto,
  type UpdateUsersDto,
  UserRole,
} from "../users.types";

import {
  useCreateUsersMutation,
  useUpdateUsersMutation,
} from "../services/UsersApi";
import isEqual from "lodash.isequal";
import { useGetDocumentsTypeQuery } from "../../documentType/services/documentTypeApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: UserInfoTypes) => void;
  editingUsers?: Partial<UserInfoTypes>;
  isSubmitting?: boolean;
};

const UsersTypeModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingUsers,
  isSubmitting,
}: Props) => {
  const { id: routeId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(editingUsers?.id || null);

  const [createUser, createStatus] = useCreateUsersMutation();
  const [updateUser, updateStatus] = useUpdateUsersMutation();

  const mapCreateDto = (v: UserInfoTypes): CreateUsersDto => {
    return {
      basicInfo: {
        firstName: v.firstName,
        surName: v.surName,
        email: v.email,
        phone: Number(v.phone),
        street: v.street,
        city: v.city,
        postCode: v.postcode,
        dateOfBirth: v.dob,
        cashInRate: v.cashInRate ?? null,
        NiRate: v.niRate ?? null,
        shareCode: v.shareCode ?? null,
        role: v.type === "owner" ? UserRole.OWNER : UserRole.STAFF,
      },
    };
  };

  const mapUpdateDto = (v: UserInfoTypes, userId: string): UpdateUsersDto => {
    return {
      userBankDetails:
        (v.bankDetails || []).map((b) => ({
          userId,
          accountNumber: b.accountNumber || "",
          sortCode: b.sortCode || "",
          bankName: b.bankName || "",
          accountHolderName: b.accountHolderName || "",
          iban: b.iban || "",
          swiftCode: b.swiftCode || "",
        })) || [],
      userAvailability: (v.openingHours || []).map((o) => ({
        day: o.day,
        open: o.closed ? null : o.open || null,
        close: o.closed ? null : o.close || null,
        closed: !!o.closed,
      })),
      documents: {
        fileS3Key: v.fileS3Key ?? null,
        fileType: v.fileType || "",
        expiresAt: v.expiresAt ?? null,
        remindBeforeDays: v.remindBeforeDays ?? null,
      },
    };
  };

  const baseSteps = useMemo(
    () => [
      { key: "basic", label: "Basic Info" },
      { key: "account", label: "Account Information" },
      { key: "availability", label: "Availability" },
      { key: "documents", label: "Documents" },
    ],
    [],
  );

  const getVisibleSteps = (type: UserInfoTypes["type"]) =>
    type === "owner"
      ? baseSteps.filter((s) => s.key !== "availability")
      : baseSteps;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUsers ? "Edit User" : "Add User"}
      width="max-w-5xl"
    >
      <Formik<UserInfoTypes>
        initialValues={{
          ...userEmptyInitialValues,
          ...(editingUsers || {}),
        }}
        validationSchema={userSchema([])} // default, update below
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          setFieldTouched,
          validateForm,
          submitForm,
        }) => {
          // Fetch document types dynamically
          const { data: documentTypes } = useGetDocumentsTypeQuery(
            { role: values.type },
            { skip: !values.type }
          );

          const documentsList = useMemo(() => {
            if (!documentTypes?.data) return [];
            return documentTypes.data;
          }, [documentTypes]);

          const steps = getVisibleSteps(values.type);
          const totalSteps = steps.length;
          const currentIndex =
            activeStep >= totalSteps ? totalSteps - 1 : activeStep;
          const current = steps[currentIndex];

          const stepKeysOf = (stepIdx: number) =>
            userStepFieldKeys[
            steps[stepIdx].key as keyof typeof userStepFieldKeys
            ];

          const stepHasErrors = (
            allErrors: Record<string, any>,
            stepIdx: number,
          ) => {
            const keys = stepKeysOf(stepIdx);
            return keys.some((k) => getIn(allErrors, k) !== undefined);
          };

          const goNext = async () => {
            const stepKeys =
              userStepFieldKeys[current.key as keyof typeof userStepFieldKeys];
            await Promise.all(
              stepKeys.map((k) => setFieldTouched(k, true, false)),
            );

            const allErrors = await validateForm();
            const stepErrors = stepKeys.filter(
              (k) => getIn(allErrors, k) !== undefined,
            );

            if (stepErrors.length) {
              const first = stepErrors[0];
              const safe = first.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
              const el = document.querySelector(
                `[name="${safe}"], [name="${safe}[]"]`,
              ) as HTMLElement | null;
              if (el && "focus" in el) (el as any).focus();
              return;
            }

            if (current.key === "basic" && !editingUsers && !userId) {
              const payload = mapCreateDto(values);
              const res = await createUser(payload).unwrap();
              const newId = (res as any)?.id || (res as any)?._id;
              setUserId(newId ?? null);
              if (newId) setFieldValue("id", newId);
            }

            if (editingUsers || userId) {
              try {
                const idForPut = userId || values.id;
                if (!idForPut) {
                  console.error("No userId to update.");
                  return;
                }

                if (current.key === "basic") {
                  const newBasic = mapCreateDto(values).basicInfo;
                  const oldBasic = {
                    firstName: editingUsers?.firstName,
                    surName: editingUsers?.surName,
                    email: editingUsers?.email,
                    phone: editingUsers?.phone,
                    street: editingUsers?.street,
                    city: editingUsers?.city,
                    postCode: editingUsers?.postcode,
                    dateOfBirth: editingUsers?.dob,
                    cashInRate: editingUsers?.cashInRate ?? null,
                    NiRate: editingUsers?.niRate ?? null,
                    shareCode: editingUsers?.shareCode ?? null,
                    role:
                      editingUsers?.type === "owner"
                        ? UserRole.OWNER
                        : UserRole.STAFF,
                  };

                  if (!isEqual(newBasic, oldBasic)) {
                    await updateUser({
                      id: idForPut,
                      data: { basicInfo: newBasic } as any,
                    }).unwrap();
                  }
                }

                if (current.key === "account") {
                  const newBank = mapUpdateDto(values, idForPut).userBankDetails;
                  const oldBank = editingUsers?.bankDetails || [];

                  if (!isEqual(newBank, oldBank)) {
                    await updateUser({
                      id: idForPut,
                      data: { userBankDetails: newBank },
                    }).unwrap();
                  }
                }

                if (current.key === "availability") {
                  const newAvail =
                    mapUpdateDto(values, idForPut).userAvailability;
                  const oldAvail = editingUsers?.openingHours || [];

                  if (!isEqual(newAvail, oldAvail)) {
                    await updateUser({
                      id: idForPut,
                      data: { userAvailability: newAvail },
                    }).unwrap();
                  }
                }

                if (current.key === "documents") {
                  const newDocs = mapUpdateDto(values, idForPut).documents;
                  const oldDocs = {
                    fileS3Key: editingUsers?.fileS3Key ?? null,
                    fileType: editingUsers?.fileType || "",
                    expiresAt: editingUsers?.expiresAt ?? null,
                    remindBeforeDays: editingUsers?.remindBeforeDays ?? null,
                  };

                  if (!isEqual(newDocs, oldDocs)) {
                    await updateUser({
                      id: idForPut,
                      data: { documents: newDocs },
                    }).unwrap();
                  }
                }
              } catch (err) {
                console.error("Update user failed:", err);
              }
            }

            if (currentIndex < totalSteps - 1) {
              setActiveStep((s) => s + 1);
            } else {
              await submitForm();
              onClose?.();
            }
          };

          const isSaving =
            isSubmitting || createStatus.isLoading || updateStatus.isLoading;

          return (
            <Form className="space-y-6">
              {/* Stepper Header */}
              <div className="flex items-center justify-between">
                {steps.map((s, idx) => {
                  const isActive = idx === currentIndex;
                  const isDone = idx < currentIndex;
                  const isError = stepHasErrors(errors, idx);

                  const pillBase =
                    "flex items-center gap-2 px-3 py-2 rounded-full border text-sm cursor-pointer select-none transition";
                  const pillState = isActive
                    ? "border-orange-400 text-orange-600"
                    : isError
                      ? "border-red-400 text-red-600"
                      : isDone
                        ? "border-green-400 text-green-600"
                        : "border-gray-300 text-gray-600";

                  const dotBase =
                    "w-6 h-6 flex items-center justify-center rounded-full";
                  const dotState = isActive
                    ? "bg-orange-500 text-white"
                    : isError
                      ? "bg-red-500 text-white"
                      : isDone
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700";

                  return (
                    <div
                      key={s.key}
                      className={`flex items-center ${idx < steps.length - 1 ? "flex-1" : ""
                        }`}
                    >
                      <div
                        className={`${pillBase} ${pillState}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveStep(idx)}
                      >
                        <span className={`${dotBase} ${dotState}`}>
                          {idx + 1}
                        </span>
                        <span className="font-medium whitespace-nowrap">
                          {s.label}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="h-px flex-1 bg-gray-200 mx-2" />
                      )}
                    </div>
                  );
                })}
              </div>

              {current.key === "basic" && (
                <BasicInfoForm
                  onTypeChange={(nextType) => {
                    const visible = getVisibleSteps(nextType);
                    if (currentIndex >= visible.length)
                      setActiveStep(visible.length - 1);
                  }}
                />
              )}

              {current.key === "account" && (
                <BankDetailsFields
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                />
              )}

              {current.key === "availability" && values.type === "staff" && (
                <OpeningHoursFormSection
                  openingHours={values.openingHours}
                  setOpeningHours={(hrs) => setFieldValue("openingHours", hrs)}
                  sameAllDays={values.sameAllDays}
                  setSameAllDays={(v: boolean) => setFieldValue("sameAllDays", v)}
                />
              )}

              {current.key === "documents" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentsList.map((doc) => (
                    <div key={doc.id} className="md:col-span-2 pb-4">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {doc.name}{" "}
                        {doc.isMandatory && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>

                      {/* File Upload */}
                      <FileUploader
                        value={values.documents?.[doc.id]?.fileS3Key || ""}
                        onChange={(key) =>
                          setFieldValue(`documents.${doc.id}.fileS3Key`, key)
                        }
                        path="user-documents"
                        type="all"
                        pathId={routeId}
                        error={
                          touched.documents?.[doc.id]?.fileS3Key &&
                            errors.documents?.[doc.id]?.fileS3Key
                            ? (errors.documents?.[doc.id]
                              ?.fileS3Key as string)
                            : ""
                        }
                      />

                      {values.documents?.[doc.id]?.fileS3Key && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              File Type <span className="text-red-500">*</span>
                            </label>
                            <SelectField
                              name={`documents.${doc.id}.fileType`}
                              value={values.documents?.[doc.id]?.fileType || ""}
                              onChange={handleChange}
                              options={[
                                { label: "Passport", value: "passport" },
                                { label: "FSA Cert", value: "fsa_cert" },
                                { label: "License", value: "license" },
                              ]}
                              error={
                                touched.documents?.[doc.id]?.fileType &&
                                  errors.documents?.[doc.id]?.fileType
                                  ? (errors.documents?.[doc.id]
                                    ?.fileType as string)
                                  : ""
                              }
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Expiry Date
                            </label>
                            <DatePickerField
                              name={`documents.${doc.id}.expiresAt`}
                              value={
                                values.documents?.[doc.id]?.expiresAt || ""
                              }
                              onChange={(v: any) =>
                                setFieldValue(
                                  `documents.${doc.id}.expiresAt`,
                                  v,
                                )
                              }
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                              Remind Before (days)
                            </label>
                            <InputField
                              placeholder="Remind Before (days)"
                              name={`documents.${doc.id}.remindBeforeDays`}
                              type="number"
                              value={String(
                                values.documents?.[doc.id]?.remindBeforeDays ??
                                "",
                              )}
                              onChange={handleChange}
                              error={
                                touched.documents?.[doc.id]?.remindBeforeDays &&
                                  errors.documents?.[doc.id]?.remindBeforeDays
                                  ? (errors.documents?.[doc.id]
                                    ?.remindBeforeDays as string)
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between pt-2">
                <Button type="button" variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    disabled={currentIndex === 0 || isSaving}
                  >
                    Back
                  </Button>
                  <Button type="button" onClick={goNext} disabled={isSaving}>
                    {currentIndex < steps.length - 1
                      ? "Next"
                      : isSaving
                        ? "Saving..."
                        : "Save"}
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default UsersTypeModal;
