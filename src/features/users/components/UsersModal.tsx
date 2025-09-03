import { useEffect, useMemo, useState } from "react";
import { Formik, Form, getIn } from "formik";

import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
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
import { defaultDays } from "../../stores/helper/store-helper";
import { useTheme } from "../../../context/themeContext";

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
  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(editingUsers?.id || null);

  const [createUser, createStatus] = useCreateUsersMutation();
  const [updateUser, updateStatus] = useUpdateUsersMutation();


  const shouldUpdate = (oldVal: any, newVal: any) => !isEqual(oldVal, newVal);


  const [documentsList, setDocumentsList] = useState<any[]>([]);
  const [role, setRole] = useState<UserInfoTypes["type"]>(editingUsers?.type || "staff");

  const { data: documentTypes } = useGetDocumentsTypeQuery(
    { role },
    { skip: !role }
  );

  useEffect(() => {
    if (!documentTypes?.data) {
      setDocumentsList([]);
      return;
    }

    const userDocsMap = (editingUsers?.documents || []).reduce((acc: any, doc: any) => {
      acc[doc.documentTypeId] = doc;
      return acc;
    }, {});

    setDocumentsList(
      documentTypes.data.map((docType: any) => ({
        ...docType,
        userDoc: userDocsMap[docType.id] || null,
      }))
    );
  }, [documentTypes, editingUsers]);


  const [openingHours, setOpeningHours] = useState(
    defaultDays.map((day) => ({
      day,
      open: "11:00 am",
      close: "11:00 pm",
      closed: false,
    })),
  );
  const [sameAllDays, setSameAllDays] = useState(false);
  useEffect(() => {
    if (editingUsers?.openingHours?.length) {
      const dayMap = Object.fromEntries(
        editingUsers.openingHours.map((h) => [h.day, h]),
      );

      const mapped = defaultDays.map((day) => ({
        day,
        open: dayMap[day]?.open || "11:00 am",
        close: dayMap[day]?.close || "11:00 pm",
        closed: dayMap[day]?.closed ?? false,
      }));

      setOpeningHours(mapped);
    }
  }, [editingUsers]);

  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };
  const { isDarkMode } = useTheme();


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
        dateOfBirth: v.dateOfBirth,
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
      userDocuments: Object.entries(v.documents || {}).map(([docTypeId, doc]: [string, any]) => ({
        documentType: docTypeId,
        fileS3Key: doc.fileS3Key || null,
        fileType: doc.fileType || null,
        name: doc.name || null,
        expiresAt: doc.expiresAt || null,
        remindBeforeDays: doc.remindBeforeDays ? Number(doc.remindBeforeDays) : null,
      })),
    };
  };

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      if (!editingUsers) {
        setUserId(null);
      } else {
        setUserId(editingUsers.id || null);
      }
    }
  }, [isOpen, editingUsers]);

  const baseSteps = useMemo(
    () => [
      { key: "basic", label: "Basic Info" },
      { key: "account", label: "Account Information" },
      { key: "availability", label: "Availability" },
      { key: "documents", label: "Documents" },
    ],
    []
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
        validationSchema={userSchema(documentsList)}
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

        }) => {

          useEffect(() => {
            if (values.type && values.type !== role) {
              setRole(values.type);
            }
          }, [values.type]);


          const steps = getVisibleSteps(values.type);
          const totalSteps = steps.length;
          const currentIndex =
            activeStep >= totalSteps ? totalSteps - 1 : activeStep;
          const current = steps[currentIndex];

          const stepKeysOf = (stepIdx: number) =>
            userStepFieldKeys[
            steps[stepIdx].key as keyof typeof userStepFieldKeys
            ];

          const goNext = async () => {
            // Flatten step keys for nested fields
            const getBankFields = (values: UserInfoTypes) => {
              return values.bankDetails?.flatMap((_, idx) => [
                `bankDetails[${idx}].bankName`,
                `bankDetails[${idx}].accountNumber`,
                `bankDetails[${idx}].sortCode`,
              ]) || [];
            };

            const getDocumentFields = (documentsList: any[]) =>
              documentsList.flatMap((doc) => [
                `documents.${doc.id}.fileS3Key`,
                `documents.${doc.id}.fileType`,
                `documents.${doc.id}.expiresAt`,
                `documents.${doc.id}.remindBeforeDays`,
              ]);


            const stepKeys =
              current.key === "account"
                ? getBankFields(values)
                : current.key === "documents"
                  ? getDocumentFields(documentsList || [])
                  : userStepFieldKeys[current.key as keyof typeof userStepFieldKeys];


            await Promise.all(stepKeys.map((k) => setFieldTouched(k, true, false)));


            const allErrors = await validateForm();
            const stepErrors = stepKeys.filter((k) => getIn(allErrors, k) !== undefined);


            if (stepErrors.length) {
              const first = stepErrors[0];
              const safe = first.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
              const el = document.querySelector(
                `[name="${safe}"], [name="${safe}[]"]`
              ) as HTMLElement | null;
              if (el && "focus" in el) (el as any).focus();
              return;
            }

            let idForPut = userId || values.id;


            if (current.key === "basic" && !editingUsers && !idForPut) {
              try {
                const payload = mapCreateDto(values);
                const res: any = await createUser(payload).unwrap();
                const newId = res.user?.id || res.id || res.data?.id;
                if (newId) {
                  setUserId(newId);
                  await setFieldValue("id", newId);
                  idForPut = newId;
                } else {
                  console.error("User create response missing ID", res);
                  return;
                }
              } catch (err) {
                console.error("Create user failed:", err);
                return;
              }
            }

            if (!idForPut) {
              console.error("No userId found to update.");
              return;
            }

            try {

              if (current.key === "basic") {
                const newBasic = mapCreateDto(values).basicInfo;
                const oldBasic = editingUsers
                  ? mapCreateDto(editingUsers as UserInfoTypes).basicInfo
                  : null;
                if (!oldBasic || shouldUpdate(oldBasic, newBasic)) {
                  await updateUser({ id: idForPut, data: { basicInfo: newBasic } }).unwrap();
                }
              }


              if (current.key === "account") {
                const newBank = mapUpdateDto(values, idForPut).userBankDetails;
                const hasData = newBank.some(
                  (b) => b.accountNumber || b.sortCode || b.bankName || b.accountHolderName || b.iban || b.swiftCode
                );
                const oldBank = editingUsers
                  ? mapUpdateDto(editingUsers as UserInfoTypes, idForPut).userBankDetails
                  : null;
                if ((oldBank && shouldUpdate(oldBank, newBank)) || (!oldBank && hasData)) {
                  await updateUser({ id: idForPut, data: { userBankDetails: newBank } }).unwrap();
                }
              }

              if (current.key === "availability") {
                const newAvail = mapUpdateDto(values, idForPut).userAvailability;
                const oldAvail = editingUsers
                  ? mapUpdateDto(editingUsers as UserInfoTypes, idForPut).userAvailability
                  : null;
                if (!oldAvail || shouldUpdate(oldAvail, newAvail)) {
                  await updateUser({ id: idForPut, data: { userAvailability: newAvail } }).unwrap();
                }
              }


              if (current.key === "documents") {
                const newDocs = mapUpdateDto(values, idForPut).userDocuments;
                const oldDocs = editingUsers
                  ? mapUpdateDto(editingUsers as UserInfoTypes, idForPut).userDocuments
                  : null;
                if (!oldDocs || shouldUpdate(oldDocs, newDocs)) {
                  await updateUser({ id: idForPut, data: { userDocuments: newDocs } }).unwrap();
                }
              }

            } catch (err) {
              console.error("Update user failed:", err);
              return;
            }

            if (currentIndex < totalSteps - 1) {
              setActiveStep((s) => s + 1);
            } else {
              onClose?.();
            }
          };


          // const goNext = async () => {
          //   const stepKeys =
          //     userStepFieldKeys[current.key as keyof typeof userStepFieldKeys];
          //   await Promise.all(
          //     stepKeys.map((k) => setFieldTouched(k, true, false))
          //   );

          //   const allErrors = await validateForm();
          //   const stepErrors = stepKeys.filter(
          //     (k) => getIn(allErrors, k) !== undefined
          //   );

          //   if (stepErrors.length) {
          //     const first = stepErrors[0];
          //     const safe = first.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
          //     const el = document.querySelector(
          //       `[name="${safe}"], [name="${safe}[]"]`
          //     ) as HTMLElement | null;
          //     if (el && "focus" in el) (el as any).focus();
          //     return;
          //   }

          //   let idForPut = userId || values.id;

          //   if (current.key === "basic" && !editingUsers && !idForPut) {
          //     try {
          //       const payload = mapCreateDto(values);
          //       const res: any = await createUser(payload).unwrap();

          //       const newId = res.user?.id || res.id || res.data?.id;
          //       if (newId) {
          //         setUserId(newId);
          //         await setFieldValue("id", newId);
          //         idForPut = newId;
          //       } else {
          //         console.error("User create response missing ID", res);
          //         return;
          //       }
          //     } catch (err) {
          //       console.error("Create user failed:", err);
          //       return;
          //     }
          //   }

          //   if (!idForPut) {
          //     console.error("No userId found to update.");
          //     return;
          //   }

          //   try {
          //     if (current.key === "basic") {
          //       const newBasic = mapCreateDto(values).basicInfo;
          //       const oldBasic = editingUsers
          //         ? mapCreateDto(editingUsers as UserInfoTypes).basicInfo
          //         : null;

          //       if (!oldBasic || shouldUpdate(oldBasic, newBasic)) {
          //         await updateUser({
          //           id: idForPut,
          //           data: { basicInfo: newBasic },
          //         }).unwrap();
          //       }
          //     }


          //     if (current.key === "account") {
          //       const newBank = mapUpdateDto(values, idForPut).userBankDetails;


          //       const hasData = newBank.some(
          //         (b) => b.accountNumber || b.sortCode || b.bankName || b.accountHolderName || b.iban || b.swiftCode
          //       );

          //       const oldBank = editingUsers
          //         ? mapUpdateDto(editingUsers as UserInfoTypes, idForPut).userBankDetails
          //         : null;


          //       if ((oldBank && shouldUpdate(oldBank, newBank)) || (!oldBank && hasData)) {
          //         await updateUser({
          //           id: idForPut,
          //           data: { userBankDetails: newBank },
          //         }).unwrap();
          //       }
          //     }


          //     if (current.key === "availability") {
          //       const newAvail =
          //         mapUpdateDto(values, idForPut).userAvailability;
          //       const oldAvail = editingUsers
          //         ? mapUpdateDto(editingUsers as UserInfoTypes, idForPut)
          //           .userAvailability
          //         : null;

          //       if (!oldAvail || shouldUpdate(oldAvail, newAvail)) {
          //         await updateUser({
          //           id: idForPut,
          //           data: { userAvailability: newAvail },
          //         }).unwrap();
          //       }
          //     }

          //     if (current.key === "documents") {
          //       const newDocs = mapUpdateDto(values, idForPut).userDocuments;
          //       const oldDocs = editingUsers
          //         ? mapUpdateDto(editingUsers as UserInfoTypes, idForPut).userDocuments
          //         : null;

          //       if (!oldDocs || shouldUpdate(oldDocs, newDocs)) {
          //         await updateUser({
          //           id: idForPut,
          //           data: { userDocuments: newDocs },
          //         }).unwrap();
          //       }
          //     }


          //   } catch (err) {
          //     console.error("Update user failed:", err);
          //     return;
          //   }

          //   if (currentIndex < totalSteps - 1) {
          //     setActiveStep((s) => s + 1);
          //   } else {
          //     // await submitForm();
          //     onClose?.();
          //   }
          // };

          const goToStep = async (targetIdx: number) => {
            if (targetIdx <= currentIndex) {

              setActiveStep(targetIdx);
              return;
            }


            const stepKeys = stepKeysOf(currentIndex);
            await Promise.all(stepKeys.map((k) => setFieldTouched(k, true, false)));

            const allErrors = await validateForm();
            const stepErrors = stepKeys.filter((k) => getIn(allErrors, k) !== undefined);

            if (stepErrors.length === 0) {
              setActiveStep(targetIdx);
            } else {
              console.log("Validation failed, cannot move to next step");
            }
          };




          const isSaving =
            isSubmitting || createStatus.isLoading || updateStatus.isLoading;

          return (
            <Form className="space-y-6">

              <div className="flex items-center justify-between">
                {steps.map((s, idx) => {
                  const isActive = idx === currentIndex;
                  const isDone = idx < currentIndex;


                  const pillBase =
                    "flex items-center gap-2 px-3 py-2 rounded-full border text-sm cursor-pointer select-none transition";
                  const pillState = isActive
                    ? `border-orange-400 ${isDarkMode ? "border-slate-500 text-white" : "border-orange-400 text-orange-600"} text-orange-600`
                    : isDone
                      ? "border-green-400 text-green-600"
                      : "border-gray-300 text-gray-600";

                  return (
                    <div key={s.key} className={`flex items-center ${idx < steps.length - 1 ? "flex-1" : ""}`}>
                      <div
                        className={`${pillBase} ${pillState}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => goToStep(idx)}
                      >
                        <span>{idx + 1}</span>
                        <span className="font-medium whitespace-nowrap">
                          {s.label}
                        </span>
                      </div>
                      {idx < steps.length - 1 && <div className="h-px flex-1 bg-gray-200 mx-2" />}
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
                  setFieldTouched={setFieldTouched}
                  errors={errors}
                  touched={touched}
                />
              )}

              {current.key === "availability" && values.type === "staff" && (

                <OpeningHoursFormSection
                  openingHours={openingHours}
                  setOpeningHours={setOpeningHours}
                  sameAllDays={sameAllDays}
                  setSameAllDays={setSameAllDays}
                />
              )}
              {current.key === "documents" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[100px]">
                  {documentsList.length === 0 ? (
                    <div className="col-span-2 flex justify-center items-center">
                      <p className="text-gray-500">No Documents available for this role.</p>
                    </div>
                  ) : (
                    documentsList.map((doc) => (
                      <div key={doc.id} className="md:col-span-2 pb-4">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          {doc.name} {doc.isMandatory && <span className="text-red-500">*</span>}
                        </label>

                        <FileUploader
                          value={
                            values.documents?.[doc.id]?.fileS3Key ||
                            doc.userDoc?.fileS3Key ||
                            ""
                          }
                          onChange={(fileS3Key) => {
                            const prevDocs = values.documents || {};
                            setFieldValue("documents", {
                              ...prevDocs,
                              [doc.id]: {
                                ...(prevDocs[doc.id] || {}),
                                documentType: doc.id,
                                fileS3Key,
                                fileType: prevDocs[doc.id]?.fileType || "all",
                                name: doc.name,
                              },
                            });
                          }}
                          path="users-documents"
                          type="all"
                          pathId={doc.id}
                        />

                        {(values.documents?.[doc.id]?.fileS3Key || doc.userDoc?.fileS3Key) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Expiry Date
                              </label>
                              <DatePickerField
                                name={`documents.${doc.id}.expiresAt`}
                                value={formatDateOnly(
                                  values.documents?.[doc.id]?.expiresAt ||
                                  doc.userDoc?.expiresAt
                                )}
                                onChange={(v: any) =>
                                  setFieldValue(`documents.${doc.id}.expiresAt`, v)
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
                                  doc.userDoc?.remindBeforeDays ??
                                  ""
                                )}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

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
                    {currentIndex < steps.length - 1 ? "Next" : isSaving ? "Saving..." : "Save"}
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
