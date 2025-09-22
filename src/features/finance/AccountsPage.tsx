// FILE: src/features/finance/pages/AccountsPage.tsx
import React, { useState } from "react";
import {
  useGetAccountsQuery,
  useDeleteAccountMutation,
} from "./services/financeAccountApi";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { DynamicTable, type Column } from "../../components/DynamicTable";
import ConfirmDelete from "../../components/ConfirmDelete";
import AccountModal from "./components/AccountModal";
import { toast } from "react-toastify";

const AccountsPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: accounts = [], isLoading } = useGetAccountsQuery(
    query || typeFilter
      ? { q: query || undefined, account_type: typeFilter as any }
      : undefined,
  );
  const [del] = useDeleteAccountMutation();

  const columns: Column<any>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "account_type", label: "Account Type" },
    { key: "detail_type", label: "Detail Type" },
    { key: "default_vat_code", label: "VAT Code" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditing(row);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <ConfirmDelete
            onConfirm={async () => {
              await del(row.id).unwrap();
              toast.success("Deleted");
            }}
            renderTrigger={({ open }) => (
              <Button size="sm" variant="danger" onClick={open}>
                Delete
              </Button>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chart of accounts</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          New account
        </Button>
      </div>

      <div className="mb-4 flex gap-3">
        <InputField
          className="w-72"
          placeholder="Filter by name or number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded border px-2 py-2"
          value={typeFilter ?? ""}
          onChange={(e) => setTypeFilter(e.target.value || undefined)}
        >
          <option value="">All types</option>
          <option value="current_assets">Current assets</option>
          <option value="tangible_assets">Tangible assets</option>
          <option value="intangible_assets">Intangible assets</option>
          <option value="current_liabilities">Current liabilities</option>
          <option value="long_term_liabilities">Long-term liabilities</option>
          <option value="equity">Equity</option>
          <option value="income">Income</option>
          <option value="cost_of_sales">Cost of sales</option>
          <option value="expenses">Expenses</option>
          <option value="other_income">Other income</option>
          <option value="other_expenses">Other expenses</option>
        </select>
      </div>

      <DynamicTable
        data={accounts}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
      <AccountModal
        isOpen={open}
        onClose={() => setOpen(false)}
        editing={editing}
      />
    </div>
  );
};
export default AccountsPage;
