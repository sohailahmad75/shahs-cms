export const productFiltersConfig = [
  {
    key: "isActive",
    label: "Status",
    type: "select",
    options: [
      { label: "All", value: "" },
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
  { key: "categoryId", label: "Category", type: "text" },
  { key: "minPrice", label: "Min Price", type: "number" },
  { key: "maxPrice", label: "Max Price", type: "number" },
];
export const UOM_OPTIONS = [
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Gram (g)", value: "g" },
  { label: "Litre (ltr)", value: "ltr" },
  { label: "Millilitre (ml)", value: "ml" },
  { label: "Pieces (pcs)", value: "pcs" },
];

export const VISIBILITY_OPTIONS = [
  { label: "Store", value: "store" },
  { label: "Warehouse", value: "warehouse" },
];
