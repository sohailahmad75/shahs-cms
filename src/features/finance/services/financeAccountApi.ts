// FILE: src/features/finance/services/financeAccountApi.ts
import { baseApi } from "../../../services/baseApi";

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

export interface FinanceAccount {
  id: string;
  code?: string | null;
  name: string;
  accountType: AccountType;
  detailType: string;
  parentId?: string | null;
  defaultVatCode?: string | null;
  openingBalance?: number | null;
  openingBalanceDate?: string | null;
  description?: string | null;
}

export const financeAccountApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getAccounts: b.query<
      FinanceAccount[] | { data: FinanceAccount[]; meta?: any },
      { q?: string; accountType?: AccountType; parentId?: string | null } | void
    >({
      query: (args) => {
        const p = new URLSearchParams();
        if (args?.q) p.set("q", args.q);
        if (args?.accountType) p.set("accountType", args.accountType); // map to snake for BE
        if (args?.parentId !== undefined)
          p.set("parent_id", String(args.parentId ?? ""));
        return { url: `/finance/accounts?${p.toString()}`, method: "GET" };
      },
      providesTags: [{ type: "FinanceAccounts", id: "LIST" }],
    }),

    // Options used by product form
    getProductFinanceOptions: b.query<
      any,
      { accountType: string; detailType: string } & { group?: string }
    >({
      query: (q) => ({
        url: "/finance/accounts/product-finance-options",
        params: q, // this endpoint already expects snake query keys
      }),
    }),

    getAccountTree: b.query<any, void>({
      query: () => ({ url: `/finance/accounts/tree`, method: "GET" }),
    }),
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
      invalidatesTags: (_r, _e, _a) => [
        { type: "FinanceAccounts", id: "LIST" },
      ],
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
  useGetProductFinanceOptionsQuery,
  useGetAccountTreeQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = financeAccountApi;
