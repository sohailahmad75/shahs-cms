// import { Formik, Form } from "formik";
// import Modal from "../../../components/Modal";
// import {
//   StoreTypeEnum,
//   StoreTypeOptions,
// } from "../../../common/enums/status.enum";
// import SelectField from "../../../components/SelectField";
// import InputField from "../../../components/InputField";
// import BankDetailsFields from "./BankDetailsFields";
// import Button from "../../../components/Button";
// import type { UpdateStoreDto } from "../store.types";
// import { useEffect, useState } from "react";
// import OpeningHoursFormSection from "./OpeningHoursFormSection";
// import {
//   createStoreInitialValues,
//   CreateStoreSchema,
//   defaultDays,
// } from "../helper/store-helper";
// import { filterEditableFields } from "../../../helper";
// import { useTheme } from "../../../context/themeContext";

// const StoreModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   editingStore,
//   isSubmitting,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (values: any) => void;
//   editingStore: UpdateStoreDto | null | undefined;
//   isSubmitting: boolean;
// }) => {
//   const { isDarkMode } = useTheme();
//   const [openingHours, setOpeningHours] = useState(
//     defaultDays.map((day) => ({
//       day,
//       open: "11:00 am",
//       close: "11:00 pm",
//       closed: false,
//     })),
//   );
//   const [sameAllDays, setSameAllDays] = useState(false);
//   useEffect(() => {
//     if (editingStore?.openingHours?.length) {
//       const dayMap = Object.fromEntries(
//         editingStore.openingHours.map((h) => [h.day, h]),
//       );

//       const mapped = defaultDays.map((day) => ({
//         day,
//         open: dayMap[day]?.open || "11:00 am",
//         close: dayMap[day]?.close || "11:00 pm",
//         closed: dayMap[day]?.closed ?? false,
//       }));

//       setOpeningHours(mapped);
//     }
//   }, [editingStore]);
//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={editingStore ? "Edit Store" : "Add Store"}
//       width="max-w-4xl"
//     >
//       <div className="col-span-2 flex items-center gap-6 mb-6">
//         <div className="flex-grow h-px bg-gray-200" />
//         <span className={`${isDarkMode ? "text-slate-100" :"text-orange-100"}  text-md font-medium whitespace-nowrap`}>
//           Basic Details
//         </span>
//         <div className="flex-grow h-px bg-gray-200" />
//       </div>
//       <Formik
//         initialValues={{
//           ...filterEditableFields(editingStore, createStoreInitialValues),
//           storeType:
//             editingStore?.storeType !== undefined
//               ? Number(editingStore.storeType)
//               : StoreTypeEnum.SHOP,
//         }}
//         validationSchema={CreateStoreSchema}
//         enableReinitialize
//         onSubmit={(values) => {
//           const finalValues = {
//             ...values,
//             openingHours,
//           };
//           onSubmit(finalValues);
//         }}
//       >
//         {({ values, handleChange, touched, errors, setFieldValue }) => (
//           <Form className="space-y-8">
//             {/* Basic Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {[
//                 { name: "name", label: "Store Name", required: true },
//                 { name: "email", label: "Email", required: true },
//                 {
//                   name: "companyName",
//                   label: "Company Name",
//                   required: true,
//                 },
//                 {
//                   name: "companyNumber",
//                   label: "Company Number",
//                   required: true,
//                 },
//                 { name: "phone", label: "Phone", required: true },
//                 { name: "street", label: "Street", required: true },
//                 { name: "city", label: "City", required: true },
//                 { name: "postcode", label: "Postcode", required: true },
//                 { name: "country", label: "Country", required: true },
//                 { name: "storeType", label: "Store Type", required: true },
//               ].map(({ name, label, required }) => (
//                 <div key={name}>
//                   <label className="text-sm font-medium text-gray-700 mb-1 block">
//                     {label}
//                     {required && <span className="text-red-500"> *</span>}
//                   </label>
//                   {name === "storeType" ? (
//                     <SelectField
//                       name={name}
//                       value={values[name].toString()}
//                       onChange={handleChange}
//                       options={StoreTypeOptions}
//                       error={touched[name] ? errors[name] : ""}
//                     />
//                   ) : (
//                     <InputField
//                       name={name}
//                       placeholder={label}
//                       value={values[name]}
//                       onChange={handleChange}
//                       error={touched[name] ? errors[name] : ""}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>

//             <BankDetailsFields
//               values={values}
//               setFieldValue={setFieldValue}
//               errors={errors}
//               touched={touched}
//             />

//             <div className="col-span-2 flex items-center gap-6 mb-2">
//               <div className="flex-grow h-px bg-gray-200" />
//               <span className={`${isDarkMode ? "text-slate-100" :"text-orange-100"} text-md font-medium whitespace-nowrap`}>
//                 Opening Hours
//               </span>
//               <div className="flex-grow h-px bg-gray-200" />
//             </div>
//             <OpeningHoursFormSection
//               openingHours={openingHours}
//               setOpeningHours={setOpeningHours}
//               sameAllDays={sameAllDays}
//               setSameAllDays={setSameAllDays}
//             />

//             <div className="col-span-2 flex items-center gap-6 mb-6">
//               <div className="flex-grow h-px bg-gray-200" />
//               <span className={`${isDarkMode ? "text-slate-100" :"text-orange-100"} text-md font-medium whitespace-nowrap`}>
//                 Additional Info
//               </span>
//               <div className="flex-grow h-px bg-gray-200" />
//             </div>
//             {/* Additional Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {[
//                 { name: "vatNumber", label: "VAT Number" },
//                 { name: "googlePlaceId", label: "Google Place ID" },
//                 { name: "uberStoreId", label: "Uber Eats Store ID" },
//                 { name: "deliverooStoreId", label: "Deliveroo Store ID" },
//                 { name: "justEatStoreId", label: "Just Eat Store ID" },
//                 { name: "fsaId", label: "FSA Store ID" },
//                 { name: "lat", label: "Google Place lat" },
//                 { name: "lon", label: "Google Place lon" },
//               ].map(({ name, label }) => (
//                 <div key={name}>
//                   <label className="text-sm font-medium text-gray-700 mb-1 block">
//                     {label}
//                   </label>
//                   <InputField
//                     name={name}
//                     placeholder={label}
//                     value={values[name]}
//                     onChange={handleChange}
//                     error={touched[name] ? errors[name] : ""}
//                   />
//                 </div>
//               ))}
//             </div>

//             <Button type="submit" className="w-full" loading={isSubmitting}>
//               {editingStore ? "Update Store" : "Create Store"}
//             </Button>
//           </Form>
//         )}
//       </Formik>
//     </Modal>
//   );
// };

// export default StoreModal;



import { useEffect, useMemo, useState } from "react";
import { Formik, Form, getIn } from "formik";
import isEqual from "lodash.isequal";

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
  type UpdateStoreDto,
  type StoreDocument,
} from "../store.types";

import {
  useCreateStoreMutation,
  useUpdateStoreMutation,
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
  const [updateStore, updateStatus] = useUpdateStoreMutation();

  const shouldUpdate = (oldVal: any, newVal: any) => !isEqual(oldVal, newVal);

  const [documentsList, setDocumentsList] = useState<any[]>([]);
  const { data: documentTypes } = useGetDocumentsTypeQuery(
    { role: "store" },
    { skip: !isOpen }
  );

  useEffect(() => {
    if (!documentTypes?.data) {
      setDocumentsList([]);
      return;
    }

    let docs = editingStore?.documents;
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

  const [openingHours, setOpeningHours] = useState(
    defaultDays.map((day) => ({
      day,
      open: "11:00 am",
      close: "11:00 pm",
      closed: false,
    }))
  );
  const [sameAllDays, setSameAllDays] = useState(false);

  useEffect(() => {
    if (editingStore?.openingHours?.length) {
      const dayMap = Object.fromEntries(
        editingStore.openingHours.map((h) => [h.day, h])
      );

      const mapped = defaultDays.map((day) => ({
        day,
        open: dayMap[day]?.open || "11:00 am",
        close: dayMap[day]?.close || "11:00 pm",
        closed: dayMap[day]?.closed ?? false,
      }));

      setOpeningHours(mapped);
    }
  }, [editingStore]);

  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const { isDarkMode } = useTheme();

  const mapCreateDto = (v: any): CreateStoreDto => {
    return {
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
      vatNumber: v.vatNumber || undefined,
      googlePlaceId: v.googlePlaceId || undefined,
      uberStoreId: v.uberStoreId || undefined,
      deliverooStoreId: v.deliverooStoreId || undefined,
      justEatStoreId: v.justEatStoreId || undefined,
      fsaId: v.fsaId || undefined,
      lat: v.lat || undefined,
      lon: v.lon || undefined,
      bankDetails: (v.bankDetails || []).map((b: any) => ({
         id: b.id || undefined,
        bankName: b.bankName || "",
        accountNumber: b.accountNumber || "",
        sortCode: b.sortCode || "",
        accountHolderName: b.accountHolderName || undefined,
        iban: b.iban || undefined,
        swiftCode: b.swiftCode || undefined,
      })),
    };
  };

  const mapUpdateDto = (v: any, storeId: string): Partial<UpdateStoreDto> => {
    return {
      id: storeId,
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
      vatNumber: v.vatNumber || undefined,
      googlePlaceId: v.googlePlaceId || undefined,
      uberStoreId: v.uberStoreId || undefined,
      deliverooStoreId: v.deliverooStoreId || undefined,
      justEatStoreId: v.justEatStoreId || undefined,
      fsaId: v.fsaId || undefined,
      lat: v.lat || undefined,
      lon: v.lon || undefined,
      bankDetails: (v.bankDetails || []).map((b: any) => ({
         id: b.id || undefined,
        bankName: b.bankName || "",
        accountNumber: b.accountNumber || "",
        sortCode: b.sortCode || "",
        accountHolderName: b.accountHolderName || undefined,
        iban: b.iban || undefined,
        swiftCode: b.swiftCode || undefined,
      })),
      openingHours: openingHours.map((o) => ({
        day: o.day,
        open: o.closed ? null : o.open || null,
        close: o.closed ? null : o.close || null,
        closed: !!o.closed,
      })),
    };
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
          storeType: editingStore?.storeType !== undefined
            ? Number(editingStore.storeType)
            : StoreTypeEnum.SHOP,
        }}
        validationSchema={CreateStoreSchema}
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

          const stepKeysOf = (stepIdx: number) =>
            storeStepFieldKeys[
            steps[stepIdx].key as keyof typeof storeStepFieldKeys
            ];

          const goNext = async () => {
            const getBankFields = (values: any) => {
              return (
                values.bankDetails?.flatMap((_: any, idx: number) => [
                  `bankDetails[${idx}].bankName`,
                  `bankDetails[${idx}].accountNumber`,
                  `bankDetails[${idx}].sortCode`,
                ]) || []
              );
            };

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
              current.key === "account"
                ? getBankFields(values)
                : current.key === "documents"
                  ? getDocumentFields(documentsList || [])
                  : stepKeysOf(currentIndex);

            await Promise.all(
              stepKeys.map((k) => setFieldTouched(k, true, true))
            );
            const allErrors = await validateForm();
            const stepErrors = stepKeys.filter(
              (k) => getIn(allErrors, k) !== undefined
            );

            if (stepErrors.length) {
              const first = stepErrors[0];
              const safe = first.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
              const el = document.querySelector(
                `[name="${safe}"], [name="${safe}[]"]`
              ) as HTMLElement | null;
              if (el && "focus" in el) (el as any).focus();
              return;
            }

            let idForPut = storeId || values.id;

            if (current.key === "basic" && !editingStore && !idForPut) {
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
                  return;
                }
              } catch (err) {
                console.error("Create store failed:", err);
                return;
              }
            }

            if (!idForPut) {
              console.error("No storeId found to update.");
              return;
            }

            try {
              if (current.key === "basic") {
                const newBasic = mapCreateDto(values);
                const oldBasic = editingStore
                  ? mapCreateDto(editingStore as any)
                  : null;
                if (!oldBasic || shouldUpdate(oldBasic, newBasic)) {
                  await updateStore({
                    id: idForPut,
                    data: newBasic,
                  }).unwrap();
                }
              }

              if (current.key === "account") {
                const newBank = mapUpdateDto(values, idForPut).bankDetails;
                const hasData = newBank?.some(
                  (b: any) =>
                    b.accountNumber || b.sortCode || b.bankName
                );
                const oldBank = editingStore?.bankDetails || [];
                if (
                  (oldBank && shouldUpdate(oldBank, newBank)) ||
                  (!oldBank && hasData)
                ) {
                  await updateStore({
                    id: idForPut,
                    data: { bankDetails: newBank },
                  }).unwrap();
                }
              }

              if (current.key === "availability") {
                const newAvail = mapUpdateDto(values, idForPut).openingHours;
                const oldAvail = editingStore?.openingHours || [];
                if (!oldAvail || shouldUpdate(oldAvail, newAvail)) {
                  await updateStore({
                    id: idForPut,
                    data: { openingHours: newAvail },
                  }).unwrap();
                }
              }

              if (current.key === "additional") {
                const newAdditional = {
                  vatNumber: values.vatNumber,
                  googlePlaceId: values.googlePlaceId,
                  uberStoreId: values.uberStoreId,
                  deliverooStoreId: values.deliverooStoreId,
                  justEatStoreId: values.justEatStoreId,
                  fsaId: values.fsaId,
                  lat: values.lat,
                  lon: values.lon,
                };
                const oldAdditional = {
                  vatNumber: editingStore?.vatNumber,
                  googlePlaceId: editingStore?.googlePlaceId,
                  uberStoreId: editingStore?.uberStoreId,
                  deliverooStoreId: editingStore?.deliverooStoreId,
                  justEatStoreId: editingStore?.justEatStoreId,
                  fsaId: editingStore?.fsaId,
                  lat: editingStore?.lat,
                  lon: editingStore?.lon,
                };
                if (
                  !oldAdditional ||
                  shouldUpdate(oldAdditional, newAdditional)
                ) {
                  await updateStore({
                    id: idForPut,
                    data: newAdditional,
                  }).unwrap();
                }
              }

              if (current.key === "documents") {
                const newDocs: StoreDocument[] = Object.entries(values.documents || {}).map(
                  ([docTypeId, doc]: [string, any]) => ({
                    documentTypeId: docTypeId,   // ✅ fixed
                    fileS3Key: doc.fileS3Key || "",
                    fileType: doc.fileType || "all",
                    name: doc.name || "",
                    expiresAt: doc.expiresAt || undefined,
                    remindBeforeDays: doc.remindBeforeDays
                      ? Number(doc.remindBeforeDays)
                      : undefined,
                  })
                );

                const oldDocs = editingStore?.documents || [];
                if (!oldDocs || shouldUpdate(oldDocs, newDocs)) {
                  await updateStore({
                    id: idForPut,
                    data: { documents: newDocs },
                  }).unwrap();
                }
              }
            } catch (err) {
              console.error("Update store failed:", err);
              return;
            }

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

            const stepKeys = stepKeysOf(currentIndex);
            await Promise.all(
              stepKeys.map((k) => setFieldTouched(k, true, false))
            );

            const allErrors = await validateForm();
            const stepErrors = stepKeys.filter(
              (k) => getIn(allErrors, k) !== undefined
            );

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
                <OpeningHoursFormSection
                  openingHours={openingHours}
                  setOpeningHours={setOpeningHours}
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

                          <FileUploader
                            value={
                              values.documents?.[doc.id]?.fileS3Key ||
                              doc.storeDoc?.fileS3Key ||
                              ""
                            }
                            initialPreview={doc.storeDoc?.fileUrl}
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
                            path="stores-documents"
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