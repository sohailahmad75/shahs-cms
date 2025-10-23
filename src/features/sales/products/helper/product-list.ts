import { useGetProductCategoriesQuery } from "../../productCategories/services/productCategoryApi";
import { useGetAllSupplierQuery } from "../../supplier/services/SupplierApi";

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
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
  { key: "minPrice", label: "Min Price", type: "number" },
  { key: "maxPrice", label: "Max Price", type: "number" },
  {
    key: "productType",
    label: "Product Type",
    type: "select",
    options: [
      { label: "Stock", value: "stock" },
      { label: "Non-stock", value: "non-stock" },
      { label: "Service", value: "service" },
    ],
  },
  {
    key: "usage",
    label: "Usage",
    type: "select",
    options: [
      { label: "Store", value: "store" },
      { label: "Warehouse", value: "warehouse" },
    ],
  },

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
    useQueryHook: useGetAllSupplierQuery,
    getOptionLabel: (item) => item.name,
    getOptionValue: (item) => item.id,
  },
];
