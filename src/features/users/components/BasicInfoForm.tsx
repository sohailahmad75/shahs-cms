import React from "react";
import { useFormikContext } from "formik";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import DatePickerField from "../../../components/DatePickerField";
import type { UserInfoTypes } from "../users.types";

type Props = {
  onTypeChange?: (nextType: UserInfoTypes["type"]) => void;
  typeOptions?: { label: string; value: UserInfoTypes["type"] }[];
};

const BasicInfoForm: React.FC<Props> = ({
  onTypeChange,
  typeOptions = [
    { label: "Staff", value: "staff" },
    { label: "Owner", value: "owner" },
  ],
}) => {
  const { values, handleChange, setFieldValue, errors, touched } =
    useFormikContext<UserInfoTypes>();

  const handleType = (e: any) => {
    const nextType = (e?.target?.value ?? e) as UserInfoTypes["type"];
    setFieldValue("type", nextType);
    onTypeChange?.(nextType);
  };

  const formatDateOnly = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split("T")[0]; // yyyy-MM-dd
    } catch {
      return "";
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          First Name <span className="text-red-500">*</span>
        </label>
        <InputField
          name="firstName"
          placeholder="Enter first name"
          value={values.firstName}
          onChange={handleChange}
          error={touched.firstName ? (errors.firstName as string) : ""}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Surname <span className="text-red-500">*</span>
        </label>
        <InputField
          name="surName"
          placeholder="Enter surname"
          value={values.surName}
          onChange={handleChange}
          error={touched.surName ? (errors.surName as string) : ""}
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
          Date of Birth <span className="text-red-500">*</span>
        </label>
        {/* <DatePickerField
          name="dob"
          value={values.dob as any}
          onChange={(v: any) => setFieldValue("dob", v)}
          error={touched.dob ? (errors.dob as string) : ""}
        /> */}
        <DatePickerField
          name="dob"
          value={formatDateOnly(values.dob)}
          onChange={(v: any) => setFieldValue("dob", v)}
        />

      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Cash-in Rate <span className="text-red-500">*</span>
        </label>
        <InputField
          name="cashInRate"
          type="number"
          placeholder="0"
          value={String(values.cashInRate ?? "")}
          onChange={handleChange}
          error={touched.cashInRate ? (errors.cashInRate as string) : ""}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          NI Rate <span className="text-red-500">*</span>
        </label>
        <InputField
          name="niRate"
          type="number"
          placeholder="0"
          value={String(values.niRate ?? "")}
          onChange={handleChange}
          error={touched.niRate ? (errors.niRate as string) : ""}
        />
      </div>

      {/* <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          NI Number <span className="text-red-500">*</span>
        </label>
        <InputField
          name="niNumber"
          placeholder="Enter NI number"
          value={String(values.niNumber ?? "")}
          onChange={handleChange}
          error={touched.niNumber ? (errors.niNumber as string) : ""}
        />
      </div> */}

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Share Code <span className="text-red-500">*</span>
        </label>
        <InputField
          name="shareCode"
          placeholder="Enter share code"
          value={values.shareCode ?? ""}
          onChange={handleChange}
          error={touched.shareCode ? (errors.shareCode as string) : ""}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Type <span className="text-red-500">*</span>
        </label>
        <SelectField
          name="type"
          value={values.type}
          onChange={handleType}
          options={typeOptions}
          error={touched.type ? (errors.type as string) : ""}
        />
      </div>
    </div>
  );
};

export default React.memo(BasicInfoForm);
