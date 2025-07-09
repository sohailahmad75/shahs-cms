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

const StoreSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  postcode: Yup.string().required("Postcode is required"),
  country: Yup.string().required("Country is required"),
  storeType: Yup.number().required("Store type is required"),
  companyName: Yup.string().required("Company Name is required"),
  companyNumber: Yup.string().required("Company Number is required"),
  bankDetails: Yup.array().of(
    Yup.object().shape({
      bankName: Yup.string().required("Bank name is required"),
      accountNumber: Yup.string()
        .matches(/^\d+$/, "Account number must be digits only")
        .required("Account number is required"),
      sortCode: Yup.string()
        .matches(/^\d{6}$/, "Sort code must be 6 digits")
        .required("Sort code is required"),
    }),
  ),
});

const emptyInitialValues = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  postcode: "",
  country: "United Kingdom",
  uberStoreId: "",
  deliverooStoreId: "",
  justEatStoreId: "",
  vatNumber: "",
  googlePlaceId: "",
  fsaId: "",
  companyName: "",
  companyNumber: "",
  storeType: StoreTypeEnum.SHOP,
  bankDetails: [{ bankName: "", accountNumber: "", sortCode: "" }],
};

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
  editingStore: UpdateStoreDto;
  isSubmitting: boolean;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStore ? "Edit Store" : "Add Store"}
      width="max-w-4xl"
    >
      <Formik
        initialValues={{
          ...emptyInitialValues,
          ...editingStore,
          storeType:
            editingStore?.storeType !== undefined
              ? Number(editingStore.storeType)
              : StoreTypeEnum.SHOP,
        }}
        validationSchema={StoreSchema}
        enableReinitialize
        onSubmit={onSubmit}
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

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "vatNumber", label: "VAT Number" },
                { name: "googlePlaceId", label: "Google Place ID" },
                { name: "uberStoreId", label: "Uber Eats Store ID" },
                { name: "deliverooStoreId", label: "Deliveroo Store ID" },
                { name: "justEatStoreId", label: "Just Eat Store ID" },
                { name: "fsaId", label: "FSA Store ID" },
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
