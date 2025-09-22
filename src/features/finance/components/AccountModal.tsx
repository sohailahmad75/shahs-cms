// FILE: src/features/finance/components/AccountModal.tsx
import React, { useMemo, useState } from "react";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
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
import CheckboxField from "../../../components/CheckboxField";
import DatePickerField from "../../../components/DatePickerField";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editing?: FinanceAccount | null;
}

// helper to normalize SelectField values (string or {value,label})
const pickValue = (v: any) => (typeof v === "string" ? v : (v?.value ?? ""));

const AccountModal: React.FC<Props> = ({ isOpen, onClose, editing }) => {
  const [form, setForm] = useState<Partial<FinanceAccount>>(
    editing ?? { account_type: "current_assets" as any },
  );
  const [isSub, setIsSub] = useState<boolean>(!!editing?.parent_id);

  const [createAccount, { isLoading: creating }] = useCreateAccountMutation();
  const [updateAccount, { isLoading: updating }] = useUpdateAccountMutation();

  // Parent list (same account_type only)
  const { data: parentCandidates = [] } = useGetAccountsQuery(
    form.account_type
      ? { account_type: pickValue(form.account_type) as any }
      : undefined,
  );

  // Detail types based on selected account type
  const detailOptions = useMemo(
    () =>
      DETAIL_TYPES_BY_TYPE[pickValue(form.account_type) || "current_assets"] ??
      [],
    [form.account_type],
  );

  const submit = async () => {
    const payload = {
      code: form.code || undefined,
      name: form.name || "",
      account_type: pickValue(form.account_type) as any,
      detail_type: pickValue(form.detail_type),
      default_vat_code: pickValue(form.default_vat_code) || undefined,
      parent_id: isSub ? (form.parent_id as string | undefined) : undefined,
      opening_balance:
        form.opening_balance !== undefined && form.opening_balance !== null
          ? Number(form.opening_balance)
          : undefined,
      opening_balance_date: form.opening_balance
        ? typeof form.opening_balance_date === "string"
          ? form.opening_balance_date
          : (form.opening_balance_date as any) || undefined
        : undefined,
      description: form.description || undefined,
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
      <div className="h-full w-full max-w-xl bg-white p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {editing ? "Edit account" : "New account"}
          </h2>
          <button className="text-gray-500" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <InputField
            label="Account name"
            value={form.name || ""}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="e.g. Accumulated Amortisation"
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Account type"
              options={ACCOUNT_TYPE_OPTIONS}
              // keep only the primitive in state
              value={pickValue(form.account_type)}
              onChange={(v: any) =>
                setForm((s) => ({
                  ...s,
                  account_type: pickValue(v) as any,
                  detail_type: undefined,
                  parent_id: undefined,
                }))
              }
            />
            <SelectField
              label="Detail type"
              options={detailOptions}
              value={pickValue(form.detail_type)}
              onChange={(v: any) =>
                setForm((s) => ({ ...s, detail_type: pickValue(v) }))
              }
            />
          </div>

          <CheckboxField
            label="Make this a subaccount"
            checked={isSub}
            onChange={(checked) => {
              setIsSub(checked);
              if (!checked) setForm((s) => ({ ...s, parent_id: undefined }));
            }}
          />

          {isSub && (
            <SelectField
              label="Parent account"
              options={parentCandidates
                .filter((a) => a.id !== editing?.id)
                .map((a) => ({
                  value: a.id,
                  label: `${a.name}${a.code ? ` (${a.code})` : ""}`,
                }))}
              value={(form.parent_id as string) ?? ""}
              onChange={(v: any) =>
                setForm((s) => ({ ...s, parent_id: pickValue(v) }))
              }
            />
          )}

          <SelectField
            label="Default VAT Code"
            options={[{ value: "", label: "—" }, ...VAT_OPTIONS]}
            value={pickValue(form.default_vat_code)}
            onChange={(v: any) =>
              setForm((s) => ({
                ...s,
                default_vat_code: pickValue(v) || undefined,
              }))
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Opening balance"
              type="number"
              value={form.opening_balance ?? ""}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  opening_balance: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
            />
            <DatePickerField
              label="As of"
              value={(form.opening_balance_date as any) || ""}
              onChange={(v) =>
                setForm((s) => ({ ...s, opening_balance_date: v as string }))
              }
              disabled={!form.opening_balance && form.opening_balance !== 0}
            />
          </div>

          <InputField
            label="Description"
            value={form.description || ""}
            onChange={(e) =>
              setForm((s) => ({ ...s, description: e.target.value }))
            }
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={
              !form.name ||
              !pickValue(form.account_type) ||
              !pickValue(form.detail_type)
            }
            loading={creating || updating}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
