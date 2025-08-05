import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import {
  StoreTypeEnum,
  StoreTypeOptions,
} from "../../../common/enums/status.enum";
import SelectField from "../../../components/SelectField";
import InputField from "../../../components/InputField";
import BankDetailsFields from "./BankDetailsFields";
import Button from "../../../components/Button";
import type { UpdateStoreDto } from "../types";
import { useEffect, useState } from "react";
import OpeningHoursFormSection from "./OpeningHoursFormSection";
import {
  createStoreInitialValues,
  CreateStoreSchema,
  defaultDays,
} from "../helper/store-helper";

const StoreModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingStore,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editingStore: UpdateStoreDto | null | undefined;
  isSubmitting: boolean;
}) => {
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
    if (editingStore?.openingHours?.length) {
      const dayMap = Object.fromEntries(
        editingStore.openingHours.map((h) => [h.day, h]),
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStore ? "Edit Store" : "Add Store"}
      width="max-w-4xl"
    >
      <div className="col-span-2 flex items-center gap-6 mb-6">
        <div className="flex-grow h-px bg-gray-200" />
        <span className="text-orange-100 text-md font-medium whitespace-nowrap">
          Basic Details
        </span>
        <div className="flex-grow h-px bg-gray-200" />
      </div>
      <Formik
        initialValues={{
          ...createStoreInitialValues,
          ...editingStore,
          storeType:
            editingStore?.storeType !== undefined
              ? Number(editingStore.storeType)
              : StoreTypeEnum.SHOP,
        }}
        validationSchema={CreateStoreSchema}
        enableReinitialize
        onSubmit={(values) => {
          const finalValues = {
            ...values,
            openingHours,
          };
          onSubmit(finalValues);
        }}
      >
        {({ values, handleChange, touched, errors, setFieldValue }) => (
          <Form className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "name", label: "Store Name", required: true },
                { name: "email", label: "Email", required: true },
                {
                  name: "companyName",
                  label: "Company Name",
                  required: true,
                },
                {
                  name: "companyNumber",
                  label: "Company Number",
                  required: true,
                },
                { name: "phone", label: "Phone", required: true },
                { name: "street", label: "Street", required: true },
                { name: "city", label: "City", required: true },
                { name: "postcode", label: "Postcode", required: true },
                { name: "country", label: "Country", required: true },
                { name: "storeType", label: "Store Type", required: true },
              ].map(({ name, label, required }) => (
                <div key={name}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                  </label>
                  {name === "storeType" ? (
                    <SelectField
                      name={name}
                      value={values[name].toString()}
                      onChange={handleChange}
                      options={StoreTypeOptions}
                      error={touched[name] ? errors[name] : ""}
                    />
                  ) : (
                    <InputField
                      name={name}
                      placeholder={label}
                      value={values[name]}
                      onChange={handleChange}
                      error={touched[name] ? errors[name] : ""}
                    />
                  )}
                </div>
              ))}
            </div>

            <BankDetailsFields
              values={values}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
            />

            <div className="col-span-2 flex items-center gap-6 mb-2">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="text-orange-100 text-md font-medium whitespace-nowrap">
                Opening Hours
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>
            <OpeningHoursFormSection
              openingHours={openingHours}
              setOpeningHours={setOpeningHours}
              sameAllDays={sameAllDays}
              setSameAllDays={setSameAllDays}
            />

            <div className="col-span-2 flex items-center gap-6 mb-6">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="text-orange-100 text-md font-medium whitespace-nowrap">
                Additional Info
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>
            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "vatNumber", label: "VAT Number" },
                { name: "googlePlaceId", label: "Google Place ID" },
                { name: "uberStoreId", label: "Uber Eats Store ID" },
                { name: "deliverooStoreId", label: "Deliveroo Store ID" },
                { name: "justEatStoreId", label: "Just Eat Store ID" },
                { name: "fsaId", label: "FSA Store ID" },
                { name: "lat", label: "Google Place lat" },
                { name: "lon", label: "Google Place lon" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {label}
                  </label>
                  <InputField
                    name={name}
                    placeholder={label}
                    value={values[name]}
                    onChange={handleChange}
                    error={touched[name] ? errors[name] : ""}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              {editingStore ? "Update Store" : "Create Store"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default StoreModal;
