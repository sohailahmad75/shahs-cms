// FILE: src/features/finance/constants/accountOptions.ts
// Options for Account type, Detail type, VAT — used by the modal form.
export const ACCOUNT_TYPE_OPTIONS = [
  { value: "current_assets", label: "Current assets" },
  { value: "tangible_assets", label: "Tangible assets" },
  { value: "intangible_assets", label: "Intangible assets" },
  { value: "other_current_assets", label: "Other current assets" },
  { value: "current_liabilities", label: "Current liabilities" },
  { value: "long_term_liabilities", label: "Long-term liabilities" },
  { value: "equity", label: "Equity" },
  { value: "income", label: "Income" },
  { value: "cost_of_sales", label: "Cost of sales" },
  { value: "expenses", label: "Expenses" },
  { value: "other_income", label: "Other income" },
  { value: "other_expenses", label: "Other expenses" },
];

export const DETAIL_TYPES_BY_TYPE: Record<
  string,
  { value: string; label: string }[]
> = {
  current_assets: [
    { value: "cash_on_hand", label: "Cash on hand" },
    { value: "bank", label: "Bank" },
    { value: "accounts_receivable", label: "Accounts receivable" },
    { value: "debtors", label: "Debtors" },
    { value: "prepaid_expenses", label: "Prepaid expenses" },
    { value: "stock", label: "Stock" },
    { value: "other_current_assets", label: "Other current assets" },
  ],
  tangible_assets: [
    { value: "fixed_assets", label: "Machinery and equipment" },
    {
      value: "accumulated_depreciation",
      label: "Accumulated Depreciation (contra)",
    },
  ],
  intangible_assets: [
    { value: "intangibles", label: "Intangibles" },
    {
      value: "accumulated_amortisation",
      label: "Accumulated Amortisation (contra)",
    },
  ],
  other_current_assets: [
    { value: "other_current_assets", label: "Other current assets" },
  ],
  current_liabilities: [
    { value: "accounts_payable", label: "Accounts payable" },
    { value: "credit_card", label: "Credit card" },
    { value: "other_current_liabilities", label: "Other current liabilities" },
  ],
  long_term_liabilities: [
    { value: "long_term_liability", label: "Long-term liability" },
  ],
  equity: [
    { value: "owners_equity", label: "Owner's equity" },
    { value: "retained_earnings", label: "Retained earnings" },
  ],
  income: [
    { value: "sales", label: "Sales" },
    { value: "other_primary_income", label: "Other primary income" },
    { value: "other_income_detail", label: "Other income" },
  ],
  cost_of_sales: [{ value: "cost_of_goods_sold", label: "Cost of Goods Sold" }],
  expenses: [
    { value: "expense", label: "Expense" },
    { value: "other_expense", label: "Other expense" },
  ],
  other_income: [{ value: "other_income_detail", label: "Other income" }],
  other_expenses: [{ value: "other_expense", label: "Other expense" }],
};

export const VAT_OPTIONS = [
  { value: "NO_VAT", label: "No VAT" },
  { value: "ZERO_RATE", label: "0% Z" },
  { value: "STD_20", label: "20% S" },
  { value: "REDUCED_5", label: "5% R" },
];
