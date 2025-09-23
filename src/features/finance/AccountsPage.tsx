// FILE: src/features/finance/pages/AccountsPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import FilterBar from "../../components/FilterBar";
import ConfirmDelete from "../../components/ConfirmDelete";
import ActionIcon from "../../components/ActionIcon";
import EyeOpen from "../../assets/styledIcons/EyeOpen";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import { DynamicTable, type Column } from "../../components/DynamicTable";
import { useTheme } from "../../context/themeContext";
import { useServerTable } from "../../hooks/useServerTable";

import AccountModal from "./components/AccountModal";
import {
  useGetAccountsQuery,
  useDeleteAccountMutation,
  type FinanceAccount,
} from "./services/financeAccountApi";

import {
  ACCOUNT_TYPE_OPTIONS,
  DETAIL_TYPES_BY_TYPE,
  VAT_OPTIONS,
} from "./constants/accountOptions";

// ---------- label lookups ----------
const typeLabelByValue = ACCOUNT_TYPE_OPTIONS.reduce<Record<string, string>>(
  (acc, t) => ((acc[t.value] = t.label), acc),
  {},
);

const detailLabelByValue = Object.values(DETAIL_TYPES_BY_TYPE)
  .flat()
  .reduce<Record<string, string>>(
    (acc, d) => ((acc[d.value] = d.label), acc),
    {},
  );

const vatLabelByValue = VAT_OPTIONS.reduce<Record<string, string>>(
  (acc, v) => ((acc[v.value] = v.label), acc),
  {},
);

const fmtGBP = (n: number | null | undefined) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(n)
    : "—";

// ---------- FilterBar config ----------
const accountFiltersConfig = [
  {
    key: "account_type",
    label: "Account type",
    type: "select",
    options: [{ value: "", label: "All types" }, ...ACCOUNT_TYPE_OPTIONS],
  },
  {
    key: "default_vat_code",
    label: "VAT rate",
    type: "select",
    options: [{ value: "", label: "All VAT" }, ...VAT_OPTIONS],
  },
] as const;

// ------------------------------------------------

const AccountsPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // same table controller as Stores page
  const {
    query,
    setQuery,
    setPage,
    setFilters,
    clearFilters,
    page,
    perPage,
    onPerPageChange,
    sort,
    setSort,
    queryParams,
  } = useServerTable();

  // fetch accounts (supports both array and { data, meta } shapes)
  const { data: resp, isLoading } = useGetAccountsQuery(queryParams);

  const accounts: FinanceAccount[] = useMemo(() => {
    if (Array.isArray(resp)) return resp as FinanceAccount[];
    return (resp as any)?.data ?? [];
  }, [resp]);

  const meta = (Array.isArray(resp)
    ? { total: accounts.length, page: 1, perPage, totalPages: 1 }
    : (resp as any)?.meta) || {
    total: accounts.length,
    page: 1,
    perPage,
    totalPages: 1,
  };

  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<FinanceAccount> | null>(null);

  const [del] = useDeleteAccountMutation();

  const columns: Column<FinanceAccount>[] = [
    {
      key: "index",
      label: "#",
      width: 56,
      render: (_v, _row, index) => (
        <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_v, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          {row.code ? <span className="text-xs">{row.code}</span> : null}
        </div>
      ),
    },
    {
      key: "account_type",
      label: "Account type",
      sortable: true,
      render: (_v, row) =>
        typeLabelByValue[row.account_type] ?? row.account_type,
    },
    {
      key: "detail_type",
      label: "Detail type",
      sortable: true,
      render: (_v, row) =>
        detailLabelByValue[row.detail_type] ?? row.detail_type,
    },
    {
      key: "default_vat_code",
      label: "VAT rate",
      sortable: true,
      render: (_v, row) =>
        row.default_vat_code
          ? (vatLabelByValue[row.default_vat_code] ?? row.default_vat_code)
          : "—",
    },
    {
      key: "qb_balance",
      label: "QuickBooks balance",
      align: "right",
      render: (_v, row) => {
        const val =
          typeof (row as any).balance === "number"
            ? (row as any).balance
            : typeof (row as any).qb_balance === "number"
              ? (row as any).qb_balance
              : typeof row.opening_balance === "number"
                ? row.opening_balance
                : undefined;
        return <span className="tabular-nums">{fmtGBP(val)}</span>;
      },
    },
    {
      key: "bank_balance",
      label: "Bank balance",
      align: "right",
      render: (_v, row) => (
        <span className="tabular-nums">
          {fmtGBP((row as any).bank_balance)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_v, row) => (
        <div className="flex gap-2">
          {/*<ActionIcon*/}
          {/*  title="Account history"*/}
          {/*  icon={<EyeOpen size={22} />}*/}
          {/*  className={isDarkMode ? "text-white" : "text-secondary-100"}*/}
          {/*  onClick={() =>*/}
          {/*    navigate(`/transactions/bank-transactions?account_id=${row.id}`)*/}
          {/*  }*/}
          {/*/>*/}
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
            className={
              isDarkMode
                ? "text-slate-400 hover:text-slate-200"
                : "text-gray-500 hover:text-gray-700"
            }
          />
          <ConfirmDelete
            onConfirm={async () => {
              await del(row.id).unwrap();
              toast.success("Account deleted");
            }}
            renderTrigger={({ open }) => (
              <ActionIcon
                className="text-red-500"
                icon={<TrashIcon size={22} />}
                onClick={open}
                title="Delete"
              />
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-xl font-bold">Chart of accounts</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          New account
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputField
          className="w-72"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search accounts…"
          name="query"
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          filtersConfig={accountFiltersConfig as any}
          onApplyFilters={setFilters}
          onClearAll={clearFilters}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="rounded-lg shadow-sm">
            <DynamicTable
              data={accounts}
              columns={columns}
              rowKey="id"
              tableClassName="bg-white"
              sort={sort}
              onSortChange={setSort}
              emptyMessage="No accounts yet"
            />
          </div>

          <Pagination
            className="mt-4"
            page={page}
            perPage={perPage}
            total={meta.total}
            onPageChange={setPage}
            onPerPageChange={onPerPageChange}
            perPageOptions={[10, 25, 50]}
          />
        </>
      )}

      {/* Create/Edit */}
      <AccountModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        editing={editing as any}
      />
    </div>
  );
};

export default AccountsPage;
