// FILE: src/features/finance/components/AccountModal.tsx
import React, { useMemo, useState, useEffect } from "react";
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
import CloseIcon from "../../../assets/styledIcons/CloseIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editing?: FinanceAccount | null;
}

const AccountModal: React.FC<Props> = ({ isOpen, onClose, editing }) => {
  // Normalize initial form state (keep select values as strings)
  const initialForm: Partial<FinanceAccount> = editing
    ? {
        ...editing,
        // ensure string values for selects
        account_type: String((editing as any).account_type) as any,
        detail_type: editing.detail_type
          ? String(editing.detail_type)
          : undefined,
        default_vat_code: editing.default_vat_code
          ? String(editing.default_vat_code)
          : undefined,
        parent_id: editing.parent_id ? String(editing.parent_id) : undefined,
      }
    : { account_type: "current_assets" as any };

  const [form, setForm] = useState<Partial<FinanceAccount>>(initialForm);
  const [isSub, setIsSub] = useState<boolean>(!!editing?.parent_id);

  // Reset form when modal re-opens with a different record
  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setIsSub(!!editing?.parent_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editing?.id]);

  const [createAccount, { isLoading: creating }] = useCreateAccountMutation();
  const [updateAccount, { isLoading: updating }] = useUpdateAccountMutation();

  // Parent list (same account_type only)
  const { data: parentCandidates = [] } = useGetAccountsQuery(
    form.account_type
      ? { account_type: String(form.account_type) as any }
      : undefined,
  );

  // Detail types based on selected account type
  const detailOptions = useMemo(
    () =>
      DETAIL_TYPES_BY_TYPE[String(form.account_type || "current_assets")] ?? [],
    [form.account_type],
  );

  // Build parent select options (ids as strings)
  const parentOptions = parentCandidates
    .filter((a) => a.id !== editing?.id)
    .map((a) => ({
      value: String(a.id),
      label: `${a.name}${a.code ? ` (${a.code})` : ""}`,
    }));

  const submit = async () => {
    const payload = {
      code: form.code || undefined,
      name: form.name || "",
      account_type: String(form.account_type) as any,
      detail_type: form.detail_type ? String(form.detail_type) : "",
      default_vat_code: form.default_vat_code
        ? String(form.default_vat_code)
        : undefined,
      // Cast to number here only if your backend expects numeric ids.
      parent_id: isSub
        ? form.parent_id
          ? String(form.parent_id)
          : undefined
        : undefined,
      opening_balance:
        form.opening_balance !== undefined && form.opening_balance !== null
          ? Number(form.opening_balance)
          : undefined,
      opening_balance_date: form.opening_balance
        ? (form.opening_balance_date as any) || undefined
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
          <h2 className="text-lg font-semibold text-center flex-1">
            {editing ? "Edit account" : "New account"}
          </h2>
          <button
            className="duration-200 ease-in-out hover:scale-110 cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon />
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
            {/* Account type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Account type
              </label>
              <SelectField
                name="account_type"
                value={String(form.account_type ?? "current_assets")}
                onChange={(e: any) =>
                  setForm((s) => ({
                    ...s,
                    account_type: String(e.target.value) as any,
                    // reset dependent fields
                    detail_type: undefined,
                    parent_id: undefined,
                  }))
                }
                options={ACCOUNT_TYPE_OPTIONS}
              />
            </div>

            {/* Detail type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Detail type
              </label>
              <SelectField
                name="detail_type"
                value={String(form.detail_type ?? "")}
                onChange={(e: any) =>
                  setForm((s) => ({
                    ...s,
                    detail_type: e.target.value ? String(e.target.value) : "",
                  }))
                }
                options={detailOptions}
              />
            </div>
          </div>

          <CheckboxField
            label="Make this a subaccount"
            checked={isSub}
            onChange={(checked) => {
              setIsSub(checked.target.checked);
              if (!checked.target.checked)
                setForm((s) => ({ ...s, parent_id: undefined }));
            }}
          />

          {isSub && (
            <div>
              {console.log("form.parent_id", form.parent_id)}
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Parent account
              </label>
              <SelectField
                name="parent_id"
                value={String(form.parent_id ?? "")}
                onChange={(e: any) =>
                  setForm((s) => ({
                    ...s,
                    parent_id: e.target.value
                      ? String(e.target.value)
                      : undefined,
                  }))
                }
                options={parentOptions}
              />
            </div>
          )}

          {/* VAT code */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Default VAT Code
            </label>
            <SelectField
              name="default_vat_code"
              value={String(form.default_vat_code ?? "")}
              onChange={(e: any) =>
                setForm((s) => ({
                  ...s,
                  default_vat_code: e.target.value
                    ? String(e.target.value)
                    : undefined,
                }))
              }
              options={[{ value: "", label: "—" }, ...VAT_OPTIONS]}
            />
          </div>

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
              !String(form.account_type) ||
              !String(form.detail_type || "")
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
