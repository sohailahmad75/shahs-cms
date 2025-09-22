// FILE: src/features/finance/services/financeAccountApi.ts
import { baseApi } from "../../../services/baseApi";

// FE enum for AccountType
export type AccountType =
  | "current_assets"
  | "tangible_assets"
  | "intangible_assets"
  | "other_current_assets"
  | "current_liabilities"
  | "long_term_liabilities"
  | "equity"
  | "income"
  | "cost_of_sales"
  | "expenses"
  | "other_income"
  | "other_expenses";

// FE account shape
export interface FinanceAccount {
  id: string;
  code?: string | null;
  name: string;
  account_type: AccountType;
  detail_type: string;
  parent_id?: string | null;
  default_vat_code?: string | null;
  opening_balance?: number | null;
  opening_balance_date?: string | null;
  description?: string | null;
}

export const financeAccountApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // List accounts with optional filters (q, account_type, parent_id)
    getAccounts: b.query<
      FinanceAccount[],
      {
        q?: string;
        account_type?: AccountType;
        parent_id?: string | null;
      } | void
    >({
      query: (args) => {
        const p = new URLSearchParams();
        if (args?.q) p.set("q", args.q);
        if (args?.account_type) p.set("account_type", args.account_type);
        if (args?.parent_id !== undefined)
          p.set("parent_id", String(args.parent_id ?? ""));
        return { url: `/finance/accounts?${p.toString()}`, method: "GET" };
      },
      providesTags: [{ type: "FinanceAccounts", id: "LIST" }],
    }),
    // Tree endpoint for nested selectors
    getAccountTree: b.query<any, void>({
      query: () => ({ url: `/finance/accounts/tree`, method: "GET" }),
    }),
    // Create/Update/Delete account
    createAccount: b.mutation<FinanceAccount, Partial<FinanceAccount>>({
      query: (body) => ({ url: `/finance/accounts`, method: "POST", body }),
      invalidatesTags: [{ type: "FinanceAccounts", id: "LIST" }],
    }),
    updateAccount: b.mutation<
      FinanceAccount,
      { id: string; data: Partial<FinanceAccount> }
    >({
      query: ({ id, data }) => ({
        url: `/finance/accounts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (r, e, a) => [{ type: "FinanceAccounts", id: "LIST" }],
    }),
    deleteAccount: b.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/finance/accounts/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "FinanceAccounts", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAccountsQuery,
  useGetAccountTreeQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = financeAccountApi;
