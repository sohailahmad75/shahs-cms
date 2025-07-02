// src/features/dashboard/dashboardApi.ts

import type { Menu } from "../menu-manager";
import { baseApi } from "./baseApi";
import { MenuCategory } from "../types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMenu: builder.mutation<void, Partial<Menu>>({
      query: (newMenu) => ({
        url: "/menus",
        method: "POST",
        body: newMenu,
      }),
      invalidatesTags: [{ type: "Menus" }],
    }),

    getMenus: builder.query<Menu[], void>({
      query: () => "/menus",
      providesTags: (result) =>
        result
          ? [
              ...result.map((menu) => ({
                type: "Menus" as const,
                id: menu.id,
              })),
              { type: "Menus" },
            ]
          : [{ type: "Menus" }],
    }),
    getMenuById: builder.query<Menu, string>({
      query: (id) => `/menus/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Menus", id }],
    }),
    getMenuCategories: builder.query<MenuCategory[], string>({
      query: (menuId) => `/menus/${menuId}/categories`,
      providesTags: (result, _error, menuId) =>
        result
          ? [
              ...result.map((cat) => ({
                type: "MenuCategory" as const,
                id: cat.id,
              })),
              { type: "MenuCategory", id: menuId },
            ]
          : [{ type: "MenuCategory", id: menuId }],
    }),
    createCategory: builder.mutation<
      void,
      { menuId: string; payload: Partial<MenuCategory> }
    >({
      query: ({ menuId, payload }) => ({
        url: `/menus/${menuId}/categories`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { menuId }) => [
        { type: "MenuCategory", id: menuId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMenusQuery,
  useCreateMenuMutation,
  useGetMenuByIdQuery,
  useGetMenuCategoriesQuery,
  useCreateCategoryMutation,
} = dashboardApi;
