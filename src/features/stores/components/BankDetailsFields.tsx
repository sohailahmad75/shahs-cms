import React from "react";
import { FieldArray, getIn } from "formik";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import CloseIcon from "../../../assets/styledIcons/CloseIcon";
import AddIcon from "../../../assets/styledIcons/AddIcon";

interface BankDetailsFieldsProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors: any;
  touched: any;
}

const BankDetailsFields: React.FC<BankDetailsFieldsProps> = ({
  values,
  setFieldValue,
  errors,
  touched,
}) => {
  return (
    <div>
      <div className="col-span-2 flex items-center gap-6 mb-6">
        <div className="flex-grow h-px bg-gray-200" />
        <span className="text-orange-100 text-md font-medium whitespace-nowrap">
          Bank Accounts
        </span>
        <div className="flex-grow h-px bg-gray-200" />
      </div>

      <FieldArray name="bankDetails">
        {({ push, remove }) => (
          <div className="space-y-4">
            {values.bankDetails?.map((bank: any, index: number) => {
              const prefix = `bankDetails[${index}]`;

              const getError = (field: string) =>
                getIn(touched, `${prefix}.${field}`) &&
                getIn(errors, `${prefix}.${field}`);

              return (
                <div
                  key={index}
                  className="relative grid grid-cols-1 md:grid-cols-3 gap-4 border-gray-300 border p-5 pb-7 rounded-md bg-gray-50"
                >
                  {values.bankDetails.length > 1 && (
                    <span
                      className="absolute -top-2 p-1 rounded-full -right-2 text-gray-500 hover:text-red-500 transition duration-200 ease-in-out hover:scale-110 cursor-pointer bg-white"
                      onClick={() => remove(index)}
                      role="button"
                      aria-label="Remove bank account"
                    >
                      <CloseIcon size={20} />
                    </span>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      name={`${prefix}.bankName`}
                      placeholder="Enter bank name"
                      value={bank.bankName}
                      onChange={(e) =>
                        setFieldValue(`${prefix}.bankName`, e.target.value)
                      }
                      error={getError("bankName") || ""}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      name={`${prefix}.accountNumber`}
                      placeholder="Enter account number"
                      value={bank.accountNumber}
                      onChange={(e) =>
                        setFieldValue(`${prefix}.accountNumber`, e.target.value)
                      }
                      error={getError("accountNumber") || ""}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Sort Code <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      name={`${prefix}.sortCode`}
                      placeholder="Enter sort code (e.g. 112233)"
                      value={bank.sortCode}
                      onChange={(e) =>
                        setFieldValue(`${prefix}.sortCode`, e.target.value)
                      }
                      error={getError("sortCode") || ""}
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  push({ bankName: "", accountNumber: "", sortCode: "" })
                }
              >
                <AddIcon /> Add Bank Account
              </Button>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default BankDetailsFields;
