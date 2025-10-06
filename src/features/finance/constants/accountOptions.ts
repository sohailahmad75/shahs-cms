// FILE: src/features/finance/constants/accountOptions.ts
// Options for Account type, Detail type, VAT — used by the modal form.
export const ACCOUNT_TYPE_OPTIONS = [
  { value: "debtors", label: "Debtors" },
  { value: "current_assets", label: "Current assets" },
  { value: "cash_at_bank_and_in_hand", label: "Cash at bank and in hand" },
  { value: "tangible_assets", label: "Tangible assets" },
  { value: "non_current_assets", label: "Non-current assets" },
  { value: "creditors", label: "Creditors" },
  { value: "credit_card", label: "Credit Card" },
  { value: "current_liabilities", label: "Current liabilities" },
  { value: "non_current_liabilities", label: "Non-current liabilities" },
  { value: "equity", label: "Equity" },
  { value: "income", label: "Income" },
  { value: "other_income", label: "Other income" },
  { value: "cost_of_sales", label: "Cost of sales" },
  { value: "expenses", label: "Expenses" },
  { value: "other_expenses", label: "Other expenses" },
];

export const DETAIL_TYPES_BY_TYPE: Record<
  string,
  { value: string; label: string }[]
> = {
  debtors: [{ value: "debtors", label: "Debtors" }],
  current_assets: [
    { value: "allowance_for_bad_debts", label: "Allowance for bad debts" },
    {
      value: "called_up_share_capital_not_paid",
      label: "Called up share capital not paid",
    },
    {
      value: "development_costs",
      label: "Development costs",
    },
    {
      value: "employees_cash_advances",
      label: "Employees cash advances",
    },
    {
      value: "investments_other",
      label: "Investments - Other",
    },
    {
      value: "loans_to_officers",
      label: "Loans to officers",
    },
    {
      value: "loans_to_others",
      label: "Loans to others",
    },
    {
      value: "loans_to_shareholders",
      label: "Loans to shareholders",
    },
    {
      value: "other_current_assets",
      label: "Other current assets",
    },
    {
      value: "prepaid_expenses",
      label: "Prepaid expenses",
    },
    {
      value: "retainage",
      label: "Retainage",
    },
    {
      value: "stock",
      label: "Stock",
    },
    {
      value: "undeposited_funds",
      label: "Undeposited funds",
    },
  ],
  cash_at_bank_and_in_hand: [
    { value: "cash_in_hand", label: "Cash in hand" },
    { value: "client_trust_account", label: "Client trust account" },
    { value: "current", label: "Current" },
    { value: "money_market", label: "Money market" },
    { value: "rents_held_in_trust", label: "Rents held in trust" },
    { value: "savings", label: "Savings" },
  ],
  tangible_assets: [
    { value: "accumulated_amortisation", label: "Accumulated Amortisation" },
    { value: "accumulated_depreciation", label: "Accumulated Depreciation" },
    { value: "accumulated_depletion", label: "Accumulated Depletion" },
    { value: "buildings", label: "Buildings" },
    { value: "depletable_assets", label: "Depletable Assets" },
    { value: "furniture_and_fixtures", label: "Furniture and Fixtures" },
    { value: "leasehold_improvements", label: "Leasehold Improvements" },
    { value: "machinery_and_equipment", label: "Machinery and Equipment" },
    { value: "other_tangible_assets", label: "Other tangible assets" },
    { value: "vehicles", label: "Vehicles" },
  ],
  non_current_assets: [
    {
      value: "accumulated_amortisation_of_non_current_assets",
      label: "Accumulated Amortisation of Non-current assets",
    },
    { value: "deferred_tax", label: "Deferred tax" },
    { value: "goodwill", label: "Goodwill" },
    { value: "intangible_assets", label: "Intangible assets" },
    { value: "investments", label: "Investments" },
    { value: "lease_buyout", label: "Lease buyout" },
    { value: "licenses", label: "Licenses" },
    { value: "organizational_costs", label: "Organizational costs" },
    { value: "other_non_current_assets", label: "Other non-current assets" },
    { value: "other_intangible_assets", label: "Other intangible assets" },
    {
      value: "prepayments_and_accrued_income",
      label: "Prepayments and accrued income",
    },
    { value: "security_deposits", label: "Security deposits" },
  ],
  creditors: [{ value: "creditors", label: "Creditors" }],
  credit_card: [{ value: "credit_card", label: "Credit Card" }],

  current_liabilities: [
    {
      value: "client_trust_account_liability",
      label: "Client trust accounts - Liabilities",
    },
    { value: "current_liability", label: "Current liability" },
    { value: "current_tax_liability", label: "Current tax liability" },
    { value: "insurance_payable", label: "Insurance payable" },
    { value: "lines_of_credit", label: "Lines of credit" },
    { value: "loans_payable", label: "Loans payable" },
    { value: "payroll_clearing", label: "Payroll clearing" },
    { value: "prepaid_expenses_payable", label: "Prepaid expenses - Payable" },
    { value: "rents_in_trust_liability", label: "Rents in trust - Liability" },
    {
      value: "short_term_borrowings_from_related_parties",
      label: "Short-term borrowings from related parties",
    },
    {
      value: "tax_and_national_insurance_payable",
      label: "Tax and national insurance - Payable",
    },
  ],
  non_current_liabilities: [
    {
      value: "accruals_and_deferred_income",
      label: "Accruals and deferred income",
    },
    { value: "long_term_borrowings", label: "Long-term borrowings" },
    { value: "notes_payable", label: "Notes payable" },
    {
      value: "other_non_current_liabilities",
      label: "Other non-current liabilities",
    },
    { value: "provision_for_liabilities", label: "Provision for liabilities" },
    { value: "shareholder_notes_payable", label: "Shareholder notes payable" },
  ],
  equity: [
    { value: "accumulated_adjustments", label: "Accumulated adjustments" },
    { value: "called_up_share_capital", label: "Called up share capital" },
    { value: "opening_balance_equity", label: "Opening balance equity" },
    { value: "ordinary_shares", label: "Ordinary shares" },
    { value: "owners_equity", label: "Owner's equity" },
    {
      value: "paid_in_capital_or_surplus",
      label: "Paid-in capital or surplus",
    },
    { value: "partner_contributions", label: "Partner contributions" },
    { value: "partner_distributions", label: "Partner distributions" },
    { value: "partner_equity", label: "Partner's equity" },
    { value: "personal_expense", label: "Personal expense" },
    { value: "preferred_shares", label: "Preferred shares" },
    { value: "retained_earnings", label: "Retained earnings" },
    { value: "treasury_shares", label: "Treasury shares" },
  ],
  income: [
    { value: "discounts_refunds_given", label: "Discounts/Refunds given" },
    { value: "foreign_taxes_incurred", label: "Foreign taxes incurred" },
    { value: "non_profit_income", label: "Non-profit income" },
    { value: "other_primary_income", label: "Other primary income" },
    {
      value: "rent_a_room_relief_rents_received",
      label: "Rent a room relief - Rents Received",
    },
    { value: "sales_of_product_income", label: "Sales of product income" },
    { value: "service_fees_income", label: "Service/Fee income" },
    { value: "uk_texas_withheld", label: "UK Texas withheld" },
    {
      value: "unapplied_cash_payment_income",
      label: "Unapplied cash payment income",
    },
  ],
  other_income: [
    { value: "dividend_income", label: "Dividend income" },
    { value: "interest_earned", label: "Interest earned" },
    { value: "other_investment_income", label: "Other investment income" },
    {
      value: "other_miscellaneous_income",
      label: "Other miscellaneous income",
    },
    { value: "premiums_paid", label: "Premiums paid" },
    { value: "premium_received", label: "Premium received" },
    { value: "tax_exempt_interest", label: "Tax-exempt interest" },
  ],
  cost_of_sales: [
    { value: "cost_of_labour_cos", label: "Cost of labour - COS" },
    { value: "cost_of_sales", label: "Cost of sales" },
    { value: "equipment_rental_cos", label: "Equipment rental - COS" },
    { value: "other_cost_of_sales_cos", label: "Other cost of sales - COS" },
    {
      value: "shipping_freight_and_delivery_cos",
      label: "Shipping, freight and delivery - COS",
    },
    {
      value: "supplies_and_materials_cos",
      label: "Supplies and materials - COS",
    },
  ],
  expenses: [
    { value: "advertising_promotional", label: "Advertising/promotional" },
    { value: "auto", label: "Auto" },
    { value: "bad_debts", label: "Bad debts" },
    { value: "bank_charges", label: "Bank charges" },
    { value: "carried_forward_relief", label: "Carried forward relief" },
    { value: "charitable_contributions", label: "Charitable contributions" },
    { value: "cost_of_labour", label: "Cost of labour" },
    { value: "distribution_costs", label: "Distribution costs" },
    { value: "dues_and_subscriptions", label: "Dues and subscriptions" },
    { value: "entertainment", label: "Entertainment" },
    { value: "equipment_rental", label: "Equipment rental" },
    { value: "finance_costs_restricted", label: "Finance costs - Restricted" },
    { value: "finance_costs", label: "Finance costs" },
    { value: "insurance", label: "Insurance" },
    { value: "interest_paid", label: "Interest paid" },
    { value: "legal_professional_fees", label: "Legal/professional fees" },
    { value: "meals_and_entertainment", label: "Meals and entertainment" },
    {
      value: "office_general_administrative_expenses",
      label: "Office/general & administrative expenses",
    },
    {
      value: "other_miscellaneous_service_cost",
      label: "Other miscellaneous service cost",
    },
    { value: "payroll_expenses", label: "Payroll expenses" },
    { value: "promotional_meals", label: "Promotional meals" },
    {
      value: "rent_a_room_relief_relief_claimed",
      label: "Rent a room relief - Relief claimed",
    },
    {
      value: "rent_or_lease_of_buildings",
      label: "Rent or lease of buildings",
    },
    { value: "repairs_and_maintenance", label: "Repairs and maintenance" },
    {
      value: "shipping_freight_and_delivery",
      label: "Shipping, freight and delivery",
    },
    { value: "supplies", label: "Supplies" },
    { value: "taxes_paid", label: "Taxes paid" },
    { value: "travel", label: "Travel" },
    { value: "travel_meals", label: "Travel meals" },
    {
      value: "unapplied_cash_payment_expense",
      label: "Unapplied cash payment expense",
    },
    { value: "utilities", label: "Utilities" },
  ],
  other_expenses: [
    { value: "amortisation", label: "Amortisation" },
    { value: "depreciation", label: "Depreciation" },
    { value: "exchange_gain_or_loss", label: "Exchange gain or loss" },
    { value: "other_expense", label: "Other expense" },
    { value: "penalties_and_settlements", label: "Penalties and settlements" },
  ],
};

export const VAT_OPTIONS = [
  { value: "NO_VAT", label: "No VAT" },
  { value: "S_20", label: "20% S" },
  { value: "P_20", label: "20% P" },
];
