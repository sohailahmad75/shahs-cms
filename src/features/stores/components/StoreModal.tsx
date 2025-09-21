import { useEffect, useMemo, useState } from "react";
import { Formik, Form, getIn } from "formik";
import { isEqual } from "lodash";

import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import FileUploader from "../../../components/FileUploader";
import DatePickerField from "../../../components/DatePickerField";

import BankDetailsFields from "./BankDetailsFields";
import OpeningHoursFormSection from "./OpeningHoursFormSection";
import StoreBasicInfoForm from "./StoreInfoBasic";
import StoreIntegrationInfoForm from "./AdditionalInfo";

import {
  createStoreInitialValues,
  CreateStoreSchema,
  storeStepFieldKeys,
  defaultDays,
} from "../helper/store-helper";
import {
  type Store,
  type CreateStoreDto,
  type UpdateStoreDto
} from "../store.types";

import {
  useCreateStoreMutation,
  useUpdateStoresMutation,
} from "../services/storeApi";
import { useGetDocumentsTypeQuery } from "../../documentType/services/documentTypeApi";
import { useTheme } from "../../../context/themeContext";
import { StoreTypeEnum } from "../../../common/enums/status.enum";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Store) => void;
  editingStore?: Partial<Store>;
  isSubmitting?: boolean;
};

const StoreModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingStore,
  isSubmitting,
}: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [storeId, setStoreId] = useState<string | null>(editingStore?.id || null);

  const [createStore, createStatus] = useCreateStoreMutation();
  const [updateStore, updateStatus] = useUpdateStoresMutation();

  const shouldUpdate = (oldVal: any, newVal: any) => !isEqual(oldVal, newVal);

  const [documentsList, setDocumentsList] = useState<any[]>([]);
  const { data: documentTypes } = useGetDocumentsTypeQuery(
    { role: "shop" },
    { skip: !isOpen }
  );

  useEffect(() => {
    if (!documentTypes?.data) {
      setDocumentsList([]);
      return;
    }

    let docs = editingStore?.storeDocuments;
    if (typeof docs === "string") {
      try {
        docs = JSON.parse(docs);
      } catch {
        docs = [];
      }
    }

    let storeDocsMap: Record<string, any> = {};

    if (Array.isArray(docs)) {
      storeDocsMap = docs.reduce((acc: any, doc: any) => {
        acc[doc.documentTypeId] = doc;
        return acc;
      }, {});
    } else if (docs && typeof docs === "object") {
      storeDocsMap = docs;
    }

    setDocumentsList(
      documentTypes.data.map((docType: any) => ({
        ...docType,
        storeDoc: storeDocsMap[docType.id] || null,
      }))
    );
  }, [documentTypes, editingStore]);

  // const [openingHours, setOpeningHours] = useState(
  //   defaultDays.map((day) => ({
  //     day,
  //     open: "11:00 am",
  //     close: "11:00 pm",
  //     closed: false,
  //   }))
  // );

  const [openingHours, setOpeningHours] = useState(
    defaultDays.map((day) => ({
      day,
      open: "11:00 am",
      close: "11:00 pm",
      closed: false,
    }))
  );
  const [sameAllDays, setSameAllDays] = useState(false);

  // useEffect(() => {
  //   if (editingStore?.availabilityHour?.length) {
  //     const dayMap = Object.fromEntries(
  //       editingStore.availabilityHour.map((h) => [h.day, h])
  //     );

  //     const mapped = defaultDays.map((day) => ({
  //       day,
  //       open: dayMap[day]?.open || "11:00 am",
  //       close: dayMap[day]?.close || "11:00 pm",
  //       closed: dayMap[day]?.closed ?? false,
  //     }));

  //     setOpeningHours(mapped);
  //   }
  // }, [editingStore]);

  useEffect(() => {
    const source = editingStore?.availabilityHour || editingStore?.storeAvailability;

    if (source?.length) {
      const dayMap = Object.fromEntries(
        source.map((h: any) => [h.day, h])
      );

      const mapped = defaultDays.map((day) => ({
        id: dayMap[day]?.id || null,
        day,
        open: dayMap[day]?.open || "11:00 am",
        close: dayMap[day]?.close || "11:00 pm",
        closed: dayMap[day]?.closed ?? false,
      }));

      setOpeningHours(mapped);
    } else {
      setOpeningHours(
        defaultDays.map((day) => ({
          day,
          open: "11:00 am",
          close: "11:00 pm",
          closed: false,
        }))
      );
    }
  }, [editingStore]);

  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const { isDarkMode } = useTheme();

  const mapCreateDto = (v: any): CreateStoreDto => {
    return {
      storeBasicInfo: {
        name: v.name,
        email: v.email,
        phone: v.phone,
        street: v.street,
        city: v.city,
        postcode: v.postcode,
        country: v.country,
        companyName: v.companyName,
        companyNumber: v.companyNumber,
        storeType: v.storeType,
      },
    };
  };

  const mapUpdateDto = (v: any, storeId: string): Partial<UpdateStoreDto> => {
    const updateData: Partial<UpdateStoreDto> = { id: storeId };


    if (activeStep === 0) {
      updateData.storeBasicInfo = {
        name: v.name,
        email: v.email,
        phone: v.phone,
        street: v.street,
        city: v.city,
        postcode: v.postcode,
        country: v.country,
        companyName: v.companyName,
        companyNumber: v.companyNumber,
        storeType: v.storeType,
      };
    }

    if (activeStep === 1 && v.bankDetails?.length) {
      updateData.storeBankDetails = v.bankDetails.map((b: any) => ({
        id: b.id || undefined,
        bankName: b.bankName || "",
        accountNumber: b.accountNumber || "",
        sortCode: b.sortCode || "",
        accountHolderName: b.accountHolderName || undefined,
        iban: b.iban || undefined,
        swiftCode: b.swiftCode || undefined,
      }));
    }

    if (activeStep === 2) {
      // updateData.availabilityHour = openingHours.map((o) => ({
      //   day: o.day,
      //   open: o.closed ? null : o.open || null,
      //   close: o.closed ? null : o.close || null,
      //   closed: !!o.closed,
      // }));
      updateData.storeAvailability = (v.storeAvailability || []).map((o: any) => ({
        id: o.id || undefined,
        day: o.day,
        open: o.closed ? null : o.open || null,
        close: o.closed ? null : o.close || null,
        closed: !!o.closed,
      }));
    }

    if (activeStep === 3 && (v.vatNumber || v.googlePlaceId || v.uberStoreId || v.deliverooStoreId ||
      v.justEatStoreId || v.fsaId || v.lat || v.lon)) {
      updateData.storeAdditionalInfo = {
        vatNumber: v.vatNumber || undefined,
        googlePlaceId: v.googlePlaceId || undefined,
        uberStoreId: v.uberStoreId || undefined,
        deliverooStoreId: v.deliverooStoreId || undefined,
        justEatStoreId: v.justEatStoreId || undefined,
        fsaId: v.fsaId || undefined,
        lat: v.lat || undefined,
        lon: v.lon || undefined,
      };
    }

    if (activeStep === 4 && v.documents && Object.keys(v.documents).length > 0) {
      updateData.storeDocuments = Object.entries(v.documents).map(
        ([docTypeId, doc]: [string, any]) => ({
          documentType: docTypeId,
          fileS3Key: doc.fileS3Key || "",
          fileType: doc.fileType || "all",
          name: doc.name || "",
          expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString() : undefined,
          remindBeforeDays: doc.remindBeforeDays ? Number(doc.remindBeforeDays) : undefined,
        })
      );
    }

    return updateData;
  };

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      if (!editingStore) {
        setStoreId(null);
      } else {
        setStoreId(editingStore.id || null);
      }
    }
  }, [isOpen, editingStore]);

  const steps = useMemo(
    () => [
      { key: "basic", label: "Basic Details" },
      { key: "account", label: "Account Information" },
      { key: "availability", label: "Availability" },
      { key: "additional", label: "Additional Info" },
      { key: "documents", label: "Documents" },
    ],
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStore ? "Edit Store" : "Add Store"}
      width="max-w-5xl"
    >
      <Formik
        initialValues={{
          ...createStoreInitialValues,
          ...(editingStore || {}),
          storeAvailability: editingStore?.availabilityHour || editingStore?.storeAvailability || defaultDays.map(d => ({
            day: d,
            open: "11:00 am",
            close: "11:00 pm",
            closed: false
          })),
          storeType: editingStore?.storeType !== undefined
            ? Number(editingStore.storeType)
            : StoreTypeEnum.SHOP,

          documents: editingStore?.storeDocuments
            ? (Array.isArray(editingStore.storeDocuments)
              ? editingStore.storeDocuments.reduce((acc: any, doc: any) => {
                acc[doc.documentType] = doc;
                return acc;
              }, {})
              : editingStore.storeDocuments)
            : {}
        }}
        validationSchema={CreateStoreSchema(documentsList)}
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
          const totalSteps = steps.length;
          const currentIndex =
            activeStep >= totalSteps ? totalSteps - 1 : activeStep;
          const current = steps[currentIndex];

          const validateAndSaveStep = async (currentKey: string) => {
            const getBankFields = (values: any) => (
              values.bankDetails?.flatMap((_, idx) => [
                `bankDetails[${idx}].bankName`,
                `bankDetails[${idx}].accountNumber`,
                `bankDetails[${idx}].sortCode`,
              ]) || []
            );

            const getDocumentFields = (documentsList: any[]) =>
              documentsList.flatMap((doc) => {
                const fields: string[] = [];
                if (doc.isMandatory) {
                  fields.push(`documents.${doc.id}.fileS3Key`);
                }
                fields.push(
                  `documents.${doc.id}.fileType`,
                  `documents.${doc.id}.expiresAt`,
                  `documents.${doc.id}.remindBeforeDays`
                );
                return fields;
              });

            const stepKeys =
              currentKey === "account"
                ? getBankFields(values)
                : currentKey === "documents"
                  ? getDocumentFields(documentsList || [])
                  : storeStepFieldKeys[currentKey as keyof typeof storeStepFieldKeys];

            // ✅ Run validation
            await Promise.all(stepKeys.map((k) => setFieldTouched(k, true, true)));
            const allErrors = await validateForm();
            const stepErrors = stepKeys.filter((k) => getIn(allErrors, k) !== undefined);

            if (stepErrors.length) {
              const first = stepErrors[0];
              const safe = first.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
              const el = document.querySelector(
                `[name="${safe}"], [name="${safe}[]"]`
              ) as HTMLElement | null;
              if (el && "focus" in el) (el as any).focus();
              return false;
            }

            // ✅ Create / Update logic
            let idForPut = storeId || values.id;

            if (currentKey === "basic" && !editingStore && !idForPut) {
              try {
                const payload = mapCreateDto(values);
                const res: any = await createStore(payload).unwrap();
                const newId = res.store?.id || res.id || res.data?.id;
                if (newId) {
                  setStoreId(newId);
                  await setFieldValue("id", newId);
                  idForPut = newId;
                } else {
                  console.error("Store create response missing ID", res);
                  return false;
                }
              } catch (err) {
                console.error("Create store failed:", err);
                return false;
              }
            }

            if (!idForPut) {
              console.error("No storeId found to update.");
              return false;
            }

            try {
              if (currentKey === "basic") {
                const newBasic = mapCreateDto(values).storeBasicInfo;
                const oldBasic = editingStore
                  ? mapCreateDto(editingStore as Store).storeBasicInfo
                  : null;
                if (!oldBasic || shouldUpdate(oldBasic, newBasic)) {
                  await updateStore({ id: idForPut, data: { storeBasicInfo: newBasic } }).unwrap();
                }
              }

              if (currentKey === "account") {
                const newBank = mapUpdateDto(values, idForPut).storeBankDetails;
                const hasData = newBank.some((b) => b.accountNumber || b.sortCode || b.bankName);
                const oldBank = editingStore
                  ? mapUpdateDto(editingStore as Store, idForPut).storeBankDetails
                  : null;
                if ((oldBank && shouldUpdate(oldBank, newBank)) || (!oldBank && hasData)) {
                  await updateStore({ id: idForPut, data: { storeBankDetails: newBank } }).unwrap();
                }
              }

              if (currentKey === "availability") {
                const newAvail = mapUpdateDto(values, idForPut).storeAvailability;
                const oldAvail = editingStore
                  ? mapUpdateDto(editingStore as Store, idForPut).storeAvailability
                  : null;
                if (!oldAvail || shouldUpdate(oldAvail, newAvail)) {
                  await updateStore({ id: idForPut, data: { storeAvailability: newAvail } }).unwrap();
                }
              }

              if (currentKey === "additional") {
                const newAdd = mapUpdateDto(values, idForPut).storeAdditionalInfo;
                const oldAdd = editingStore
                  ? mapUpdateDto(editingStore as Store, idForPut).storeAdditionalInfo
                  : null;
                if (!oldAdd || shouldUpdate(oldAdd, newAdd)) {
                  await updateStore({ id: idForPut, data: { storeAdditionalInfo: newAdd } }).unwrap();
                }
              }

              if (currentKey === "documents") {
                const newDocs = mapUpdateDto(values, idForPut).storeDocuments;
                const oldDocs = editingStore
                  ? mapUpdateDto(editingStore as Store, idForPut).storeDocuments
                  : null;
                if (!oldDocs || shouldUpdate(oldDocs, newDocs)) {
                  await updateStore({ id: idForPut, data: { storeDocuments: newDocs } }).unwrap();
                }
              }
            } catch (err) {
              console.error("Update store failed:", err);
              return false;
            }

            return true;
          };

          const goNext = async () => {
            const ok = await validateAndSaveStep(current.key);
            if (!ok) return;

            if (currentIndex < totalSteps - 1) {
              setActiveStep((s) => s + 1);
            } else {
              onClose?.();
            }
          };

          const goToStep = async (targetIdx: number) => {
            if (targetIdx <= currentIndex) {
              setActiveStep(targetIdx);
              return;
            }

            const ok = await validateAndSaveStep(current.key);
            if (ok) {
              setActiveStep(targetIdx);
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
                    ? `border-orange-400 ${isDarkMode
                      ? "border-slate-500 text-white"
                      : "border-orange-400 text-orange-600"
                    } text-orange-600`
                    : isDone
                      ? "border-green-400 text-green-600"
                      : "border-gray-300 text-gray-600";

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
                        onClick={() => goToStep(idx)}
                      >
                        <span>{idx + 1}</span>
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

              {current.key === "basic" && <StoreBasicInfoForm />}

              {current.key === "account" && (
                <BankDetailsFields
                  values={values}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  errors={errors}
                  touched={touched}
                />
              )}

              {current.key === "availability" && (
                // <OpeningHoursFormSection
                //   openingHours={openingHours}
                //   setOpeningHours={setOpeningHours}
                //   sameAllDays={sameAllDays}
                //   setSameAllDays={setSameAllDays}
                // />
                <OpeningHoursFormSection
                  openingHours={openingHours}
                  setOpeningHours={(updated) => {
                    setOpeningHours(updated);
                    setFieldValue("storeAvailability", updated);
                  }}
                  sameAllDays={sameAllDays}
                  setSameAllDays={setSameAllDays}
                />
              )}

              {current.key === "additional" && (
                <StoreIntegrationInfoForm />
              )}

              {current.key === "documents" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[100px]">
                  {documentsList.length === 0 ? (
                    <div className="col-span-2 flex justify-center items-center">
                      <p className="text-gray-500">
                        No Documents available for stores.
                      </p>
                    </div>
                  ) : (
                    documentsList.map((doc) => {
                      const documentError = getIn(
                        errors,
                        `documents.${doc.id}.fileS3Key`
                      );
                      const documentTouched = getIn(
                        touched,
                        `documents.${doc.id}.fileS3Key`
                      );
                      const showError = documentError && documentTouched;

                      return (
                        <div key={doc.id} className="md:col-span-2 pb-4">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            {doc.name}{" "}
                            {doc.isMandatory && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>

                          {/* <FileUploader
                            value={
                              values.documents?.[doc.id]?.fileS3Key ||
                              doc.storeDoc?.fileS3Key ||
                              ""
                            }
                            initialPreview={doc.storeDoc?.signedUrl}
                            onChange={(fileS3Key) => {
                              const prevDocs = values.documents || {};
                              setFieldValue("documents", {
                                ...prevDocs,
                                [doc.id]: {
                                  ...(prevDocs[doc.id] || {}),
                                  documentType: doc.id,
                                  fileS3Key,
                                  fileType:
                                    prevDocs[doc.id]?.fileType || "all",
                                  name: doc.name,
                                },
                              });

                              if (fileS3Key) {
                                setTimeout(() => {
                                  setFieldTouched(
                                    `documents.${doc.id}.fileS3Key`,
                                    true,
                                    true
                                  );
                                  validateForm();
                                }, 100);
                              }
                            }}
                            path="store-documents"
                            type="all"
                            pathId={doc.id}
                          /> */}

                          <FileUploader
                            value={values.documents?.[doc.id]?.fileS3Key || ""}
                            initialPreview={doc.storeDoc?.signedUrl}
                            onChange={(fileS3Key, fileName) => {
                              const prevDocs = values.documents || {};

                              if (!fileS3Key) {

                                const newDocs = { ...prevDocs };
                                delete newDocs[doc.id];
                                setFieldValue("documents", newDocs);
                              } else {

                                setFieldValue("documents", {
                                  ...prevDocs,
                                  [doc.id]: {
                                    ...(prevDocs[doc.id] || {}),
                                    documentType: doc.id,
                                    fileS3Key,
                                    fileType: prevDocs[doc.id]?.fileType || "all",
                                    name: fileName || doc.name,
                                  },
                                });
                              }

                              if (fileS3Key) {
                                setTimeout(() => {
                                  setFieldTouched(`documents.${doc.id}.fileS3Key`, true, true);
                                  validateForm();
                                }, 100);
                              }
                            }}
                            path="store-documents"
                            type="all"
                            pathId={doc.id}
                          />


                          {showError && (
                            <div className="text-red-500 text-sm mt-1">
                              {documentError}
                            </div>
                          )}

                          {(values.documents?.[doc.id]?.fileS3Key ||
                            doc.storeDoc?.fileS3Key) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Expiry Date
                                  </label>
                                  <DatePickerField
                                    name={`documents.${doc.id}.expiresAt`}
                                    value={formatDateOnly(
                                      values.documents?.[doc.id]?.expiresAt ||
                                      doc.storeDoc?.expiresAt
                                    )}
                                    onChange={(v: any) =>
                                      setFieldValue(
                                        `documents.${doc.id}.expiresAt`,
                                        v
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
                                      values.documents?.[doc.id]
                                        ?.remindBeforeDays ??
                                      doc.storeDoc?.remindBeforeDays ??
                                      ""
                                    )}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    })
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

export default StoreModal;