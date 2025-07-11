// src/features/dashboard/dashboardApi.ts

import type { Menu } from "../menu-manager";
import { baseApi } from "./baseApi";
import type { MenuCategory, MenuItem, MenuModifier } from "../types";

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
    createItem: builder.mutation({
      query: ({ categoryId, payload }) => ({
        url: `/menus/categories/${categoryId}/items`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "MenuCategory", id: categoryId },
      ],
    }),
    createModifier: builder.mutation<
      void,
      { menuId: string; payload: Partial<MenuModifier> }
    >({
      query: ({ menuId, payload }) => ({
        url: `/menus/${menuId}/modifiers`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "MenuModifiers" }],
    }),

    getModifiers: builder.query<MenuModifier[], string>({
      query: (menuId) => `/menus/${menuId}/modifiers`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((mod) => ({
                type: "MenuModifiers" as const,
                id: mod.id,
              })),
              { type: "MenuModifiers" },
            ]
          : [{ type: "MenuModifiers" }],
    }),
    getAllMenuItems: builder.query<MenuItem[], string>({
      query: (menuId) => `/menus/${menuId}/items`,
    }),
    getModifierById: builder.query<MenuModifier, string>({
      query: (modifierId) => `/menus/modifiers/${modifierId}`,
      providesTags: (_result, _err, id) => [{ type: "MenuModifiers", id }],
    }),

    updateModifier: builder.mutation<
      void,
      { id: string; payload: Partial<MenuModifier> }
    >({
      query: ({ id, payload }) => ({
        url: `/menus/modifiers/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "MenuModifiers", id },
        { type: "MenuModifiers" },
      ],
    }),
    generateDefaultMenu: builder.mutation<void, any>({
      query: () => ({
        url: "/menus/default",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Menus" }],
    }),
    syncMenuToUber: builder.mutation<void, any>({
      query: ({ id }) => ({
        url: `/menus/${id}/sync-to-uber`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Menus" }],
    }),
    assignMenuToManyStores: builder.mutation<
      void,
      { menuId: string; storeIds: string[] }
    >({
      query: (body) => ({
        url: `/store-menus/bulk-assign`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Menus"],
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
  useCreateItemMutation,
  useCreateModifierMutation,
  useGetModifiersQuery,
  useGetAllMenuItemsQuery,
  useUpdateModifierMutation,
  useGetModifierByIdQuery,
  useGenerateDefaultMenuMutation,
  useSyncMenuToUberMutation,
  useAssignMenuToManyStoresMutation,
} = dashboardApi;
