import { useGetProductCategoriesQuery } from "../../productCategories/services/productCategoryApi";

export const productFiltersConfig = [
  {
    key: 'createdAt',
    label: 'Created At',
    type: 'date',
    isRange: true,
  },
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
  { key: "minPrice", label: "Min Price", type: "number" },
  { key: "maxPrice", label: "Max Price", type: "number" },

  {
    key: "categoryId",
    label: "Category",
    type: "async-select",
    useQueryHook: useGetProductCategoriesQuery,
    getOptionLabel: (item) => item.name,
    getOptionValue: (item) => item.id,
  },
  {
    key: "supplierId",
    label: "Supplier",
    type: "async-select",
    useQueryHook: useGetProductCategoriesQuery,
    getOptionLabel: (item) => item.name,
    getOptionValue: (item) => item.id,
  },
];
