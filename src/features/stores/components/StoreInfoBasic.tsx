import React from "react";
import { useFormikContext } from "formik";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import {
  StoreTypeEnum,
  StoreTypeOptions,
} from "../../../common/enums/status.enum";

type StoreInfoTypes = {
  name: string;
  email: string;
  companyName: string;
  companyNumber: string;
  phone: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  storeType: StoreTypeEnum;
};

const StoreBasicInfoForm: React.FC = () => {
  const { values, handleChange, setFieldValue, errors, touched } =
    useFormikContext<StoreInfoTypes>();

  const handleStoreType = (e: any) => {
    const nextType = Number(e?.target?.value ?? e) as StoreTypeEnum;
    setFieldValue("storeType", nextType);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Store Name <span className="text-red-500">*</span>
        </label>
        <InputField
          name="name"
          placeholder="Enter store name"
          value={values.name}
          onChange={handleChange}
          error={touched.name ? (errors.name as string) : ""}
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Email <span className="text-red-500">*</span>
        </label>
        <InputField
          name="email"
          placeholder="Enter email"
          value={values.email}
          onChange={handleChange}
          error={touched.email ? (errors.email as string) : ""}
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Company Name <span className="text-red-500">*</span>
        </label>
        <InputField
          name="companyName"
          placeholder="Enter company name"
          value={values.companyName}
          onChange={handleChange}
          error={touched.companyName ? (errors.companyName as string) : ""}
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Company Number <span className="text-red-500">*</span>
        </label>
        <InputField
          name="companyNumber"
          placeholder="Enter company number"
          value={values.companyNumber}
          onChange={handleChange}
          error={touched.companyNumber ? (errors.companyNumber as string) : ""}
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Phone <span className="text-red-500">*</span>
        </label>
        <InputField
          name="phone"
          placeholder="Enter phone"
          value={values.phone}
          onChange={handleChange}
          error={touched.phone ? (errors.phone as string) : ""}
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Street <span className="text-red-500">*</span>
        </label>
        <InputField
          name="street"
          placeholder="Enter street"
          value={values.street}
          onChange={handleChange}
          error={touched.street ? (errors.street as string) : ""}
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          City <span className="text-red-500">*</span>
        </label>
        <InputField
          name="city"
          placeholder="Enter city"
          value={values.city}
          onChange={handleChange}
          error={touched.city ? (errors.city as string) : ""}
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Postcode <span className="text-red-500">*</span>
        </label>
        <InputField
          name="postcode"
          placeholder="Enter postcode"
          value={values.postcode}
          onChange={handleChange}
          error={touched.postcode ? (errors.postcode as string) : ""}
        />
      </div>


      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Country <span className="text-red-500">*</span>
        </label>
        <InputField
          name="country"
          placeholder="Enter country"
          value={values.country}
          onChange={handleChange}
          error={touched.country ? (errors.country as string) : ""}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Store Type <span className="text-red-500">*</span>
        </label>
        <SelectField
          name="storeType"
          value={values.storeType.toString()}
          onChange={handleStoreType}
          options={StoreTypeOptions}
          error={touched.storeType ? (errors.storeType as string) : ""}
        />
      </div>
    </div>
  );
};

export default React.memo(StoreBasicInfoForm);
