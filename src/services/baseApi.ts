import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    "Menus",
    "MenuCategory",
    "MenuModifiers",
    "ProductCategory",
    "Stores",
    "Kiosks",
    "Documents",
    "MenuItems",
    "Modifiers",
    "Users",
    "MenuCategories",
    "Category",
    "Item",
    "MenuItem",
    "DocumentsType",
    "Orders",
    "OrdersStore",
    "Products",
    "Product",
  ],
  endpoints: () => ({}),
});
