import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    "Menus",
    "MenuCategory",
    "MenuModifiers",
    "Stores",
    "Kiosks",
    "Documents",
    "MenuItems",
    "Modifiers",
    "Users",
    "MenuCategories",
    "Category",
    "Item",
    "DocumentsType"
  ],
  endpoints: () => ({}),
});
