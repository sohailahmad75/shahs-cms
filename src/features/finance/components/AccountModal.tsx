// FILE: src/features/finance/components/AccountModal.tsx
import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import CheckboxField from "../../../components/CheckboxField";
import DatePickerField from "../../../components/DatePickerField";
import CloseIcon from "../../../assets/styledIcons/CloseIcon";

import {
  ACCOUNT_TYPE_OPTIONS,
  DETAIL_TYPES_BY_TYPE,
  VAT_OPTIONS,
} from "../constants/accountOptions";
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
  FinanceAccount,
  useGetAccountsQuery,
} from "../services/financeAccountApi";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editing?: FinanceAccount | null;
}

// ---------- Validation (camelCase) ----------
const AccountSchema = Yup.object({
  name: Yup.string().trim().required("Account name is required"),
  accountType: Yup.string().required("Account type is required"),
  detailType: Yup.string().required("Detail type is required"),
  isSub: Yup.boolean().default(false),
  parentId: Yup.string().when("isSub", {
    is: true,
    then: (s) => s.required("Parent account is required"),
    otherwise: (s) => s.notRequired(),
  }),
  openingBalance: Yup.number()
    .typeError("Opening balance must be a number")
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .notRequired(),
  openingBalanceDate: Yup.mixed().when("openingBalance", {
    is: (v: any) => v !== undefined,
    then: (s) =>
      s.required("As of date is required when opening balance is set"),
    otherwise: (s) => s.notRequired(),
  }),
});

const AccountModal: React.FC<Props> = ({ isOpen, onClose, editing }) => {
  const [createAccount, createStatus] = useCreateAccountMutation();
  const [updateAccount, updateStatus] = useUpdateAccountMutation();

  const firstDetailFor = (type: string) =>
    (DETAIL_TYPES_BY_TYPE[type] || [])[0]?.value || "";

  const initialValues = useMemo(
    () => ({
      id: editing?.id || "",
      code: editing?.code || "",
      name: editing?.name || "",
      accountType: (editing?.accountType as any) || "current_assets",
      detailType:
        (editing?.detailType as any) ||
        firstDetailFor((editing?.accountType as any) || "current_assets"),
      defaultVatCode: editing?.defaultVatCode || "",
      isSub: Boolean(editing?.parentId),
      parentId: editing?.parentId || "",
      openingBalance:
        editing?.openingBalance !== undefined
          ? editing?.openingBalance
          : undefined,
      openingBalanceDate: editing?.openingBalanceDate || "",
      description: editing?.description || "",
    }),
    [editing],
  );

  // Fetch parents for selected type
  const { data: parentCandidates = [] } = useGetAccountsQuery(
    { accountType: String(initialValues.accountType) as any },
    { skip: !isOpen },
  );

  const buildParentOptions = (type: string) =>
    (parentCandidates || [])
      .filter(
        (a: any) =>
          a.id !== editing?.id && String(a.accountType) === String(type),
      )
      .map((a: any) => ({
        value: String(a.id),
        label: `${a.name}${a.code ? ` (${a.code})` : ""}`,
      }));

  const onSubmit = async (values: any) => {
    const payload = {
      code: values.code || undefined,
      name: values.name.trim(),
      accountType: String(values.accountType) as any,
      detailType: String(values.detailType),
      defaultVatCode: values.defaultVatCode || undefined,
      parentId: values.isSub ? values.parentId || undefined : undefined,
      openingBalance:
        values.openingBalance !== undefined && values.openingBalance !== null
          ? Number(values.openingBalance)
          : undefined,
      openingBalanceDate: values.openingBalance
        ? values.openingBalanceDate || undefined
        : undefined,
      description: values.description || undefined,
    };

    try {
      if (editing?.id) {
        await updateAccount({ id: editing.id, data: payload }).unwrap();
        toast.success("Account updated");
      } else {
        await createAccount(payload).unwrap();
        toast.success("Account created");
      }
      onClose();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-xl bg-white p-5 sm:p-6 md:p-7 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            {editing ? "Edit account" : "New account"}
          </h2>
          <button
            className="duration-200 ease-in-out hover:scale-110 cursor-pointer"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={AccountSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            setFieldValue,
            isSubmitting,
          }) => {
            const type = String(values.accountType || "current_assets");
            const detailOptions = DETAIL_TYPES_BY_TYPE[type] || [];
            const parentOptions = buildParentOptions(type);

            const submitting =
              isSubmitting || createStatus.isLoading || updateStatus.isLoading;

            return (
              <Form className="space-y-5">
                {/* Account name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Account name <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="e.g. Stock, Sales of Product Income"
                    error={
                      touched.name && errors.name ? (errors.name as string) : ""
                    }
                  />
                </div>

                {/* Type + Detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Account type <span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      name="accountType"
                      value={type}
                      onChange={(e: any) => {
                        const v = String(e.target.value);
                        const firstDetail =
                          (DETAIL_TYPES_BY_TYPE[v] || [])[0]?.value || "";
                        setFieldValue("accountType", v);
                        setFieldValue("detailType", firstDetail);
                        setFieldValue("isSub", false);
                        setFieldValue("parentId", "");
                      }}
                      options={ACCOUNT_TYPE_OPTIONS}
                      error={
                        touched.accountType && errors.accountType
                          ? (errors.accountType as string)
                          : ""
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Detail type <span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      name="detailType"
                      value={String(values.detailType || "")}
                      onChange={(e: any) =>
                        setFieldValue("detailType", String(e.target.value))
                      }
                      options={detailOptions}
                      error={
                        touched.detailType && errors.detailType
                          ? (errors.detailType as string)
                          : ""
                      }
                    />
                  </div>
                </div>

                {/* Subaccount */}
                <div className="pt-1">
                  <CheckboxField
                    name="isSub"
                    label="Make this a subaccount"
                    checked={!!values.isSub}
                    onChange={(checked: boolean) => {
                      setFieldValue("isSub", checked);
                      if (!checked) setFieldValue("parentId", "");
                    }}
                  />
                </div>

                {values.isSub && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Parent account <span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      name="parentId"
                      value={String(values.parentId || "")}
                      onChange={(e: any) =>
                        setFieldValue("parentId", String(e.target.value))
                      }
                      options={parentOptions}
                      error={
                        touched.parentId && errors.parentId
                          ? (errors.parentId as string)
                          : ""
                      }
                    />
                  </div>
                )}

                {/* VAT */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Default VAT Code
                  </label>
                  <SelectField
                    name="defaultVatCode"
                    value={String(values.defaultVatCode || "")}
                    onChange={(e: any) =>
                      setFieldValue(
                        "defaultVatCode",
                        e.target.value ? String(e.target.value) : "",
                      )
                    }
                    options={VAT_OPTIONS}
                  />
                </div>

                {/* Opening balance + As of */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      As of
                    </label>
                    <DatePickerField
                      name="openingBalanceDate"
                      value={(values.openingBalanceDate as any) || ""}
                      onChange={(v: any) =>
                        setFieldValue("openingBalanceDate", v)
                      }
                      disabled={
                        values.openingBalance === undefined ||
                        values.openingBalance === null
                      }
                      error={
                        touched.openingBalanceDate && errors.openingBalanceDate
                          ? (errors.openingBalanceDate as string)
                          : ""
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Opening balance
                    </label>
                    <InputField
                      name="openingBalance"
                      type="number"
                      value={values.openingBalance ?? ""}
                      onChange={(e: any) =>
                        setFieldValue(
                          "openingBalance",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      placeholder="0.00"
                      error={
                        touched.openingBalance && errors.openingBalance
                          ? (errors.openingBalance as string)
                          : ""
                      }
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Description
                  </label>
                  <InputField
                    name="description"
                    value={values.description || ""}
                    onChange={handleChange}
                    placeholder="Optional notes about this account"
                  />
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                  <Button type="button" variant="outlined" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting}>
                    Save
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AccountModal;
