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

// ---------- Validation ----------
const AccountSchema = Yup.object({
  name: Yup.string().trim().required("Account name is required"),
  account_type: Yup.string().required("Account type is required"),
  detail_type: Yup.string().required("Detail type is required"),
  isSub: Yup.boolean().default(false),
  parent_id: Yup.string().when("isSub", {
    is: true,
    then: (s) => s.required("Parent account is required"),
    otherwise: (s) => s.optional(),
  }),
  opening_balance: Yup.number()
    .typeError("Opening balance must be a number")
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .optional(),
  opening_balance_date: Yup.mixed().when("opening_balance", {
    is: (v: any) => v !== undefined,
    then: (s) =>
      s.required("As of date is required when opening balance is set"),
    otherwise: (s) => s.optional(),
  }),
});

// ---------- Component ----------
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
      account_type: (editing?.account_type as any) || "current_assets",
      // 👇 if no detail_type, pick the first one that matches the initial account_type
      detail_type:
        (editing?.detail_type as any) ||
        firstDetailFor((editing?.account_type as any) || "current_assets"),
      default_vat_code: editing?.default_vat_code || "",
      isSub: Boolean(editing?.parent_id),
      parent_id: editing?.parent_id || "",
      opening_balance:
        (editing as any)?.opening_balance !== undefined
          ? (editing as any).opening_balance
          : undefined,
      opening_balance_date: (editing as any)?.opening_balance_date || "",
      description: editing?.description || "",
    }),
    [editing],
  );

  // Fetch parents for the currently selected type (filtered in render as type changes)
  const { data: parentCandidates = [] } = useGetAccountsQuery(
    { account_type: String(initialValues.account_type) as any },
    { skip: !isOpen },
  );

  // Build friendly options for the parent select (prevent self-parenting)
  const buildParentOptions = (type: string) =>
    (parentCandidates || [])
      .filter(
        (a: any) =>
          a.id !== editing?.id && String(a.account_type) === String(type),
      )
      .map((a: any) => ({
        value: String(a.id),
        label: `${a.name}${a.code ? ` (${a.code})` : ""}`,
      }));

  const onSubmit = async (values: any) => {
    const payload = {
      code: values.code || undefined,
      name: values.name.trim(),
      account_type: String(values.account_type) as any,
      detail_type: String(values.detail_type),
      default_vat_code: values.default_vat_code || undefined,
      parent_id: values.isSub ? values.parent_id || undefined : undefined,
      opening_balance:
        values.opening_balance !== undefined && values.opening_balance !== null
          ? Number(values.opening_balance)
          : undefined,
      opening_balance_date: values.opening_balance
        ? values.opening_balance_date || undefined
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
            const type = String(values.account_type || "current_assets");
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
                      name="account_type"
                      value={type}
                      onChange={(e: any) => {
                        const v = String(e.target.value);
                        const firstDetail =
                          (DETAIL_TYPES_BY_TYPE[v] || [])[0]?.value || "";
                        setFieldValue("account_type", v);
                        setFieldValue("detail_type", firstDetail);
                        setFieldValue("isSub", false);
                        setFieldValue("parent_id", "");
                      }}
                      options={ACCOUNT_TYPE_OPTIONS}
                      error={
                        touched.account_type && errors.account_type
                          ? (errors.account_type as string)
                          : ""
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Detail type <span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      name="detail_type"
                      value={String(values.detail_type || "")}
                      onChange={(e: any) =>
                        setFieldValue("detail_type", String(e.target.value))
                      }
                      options={detailOptions}
                      error={
                        touched.detail_type && errors.detail_type
                          ? (errors.detail_type as string)
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
                    onChange={(e: any) => {
                      const checked = !!e.target.checked;
                      setFieldValue("isSub", checked);
                      if (!checked) setFieldValue("parent_id", "");
                    }}
                  />
                </div>

                {values.isSub && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Parent account <span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      name="parent_id"
                      value={String(values.parent_id || "")}
                      onChange={(e: any) =>
                        setFieldValue("parent_id", String(e.target.value))
                      }
                      options={parentOptions}
                      error={
                        touched.parent_id && errors.parent_id
                          ? (errors.parent_id as string)
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
                    name="default_vat_code"
                    value={String(values.default_vat_code || "")}
                    onChange={(e: any) =>
                      setFieldValue(
                        "default_vat_code",
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
                      name="opening_balance_date"
                      value={(values.opening_balance_date as any) || ""}
                      onChange={(v: any) =>
                        setFieldValue("opening_balance_date", v)
                      }
                      disabled={
                        values.opening_balance === undefined ||
                        values.opening_balance === null
                      }
                      error={
                        touched.opening_balance_date &&
                        errors.opening_balance_date
                          ? (errors.opening_balance_date as string)
                          : ""
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Opening balance
                    </label>
                    <InputField
                      name="opening_balance"
                      type="number"
                      value={values.opening_balance ?? ""}
                      onChange={(e: any) =>
                        setFieldValue(
                          "opening_balance",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      placeholder="0.00"
                      error={
                        touched.opening_balance && errors.opening_balance
                          ? (errors.opening_balance as string)
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
