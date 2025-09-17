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
