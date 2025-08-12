import { baseApi } from "./baseApi";
import type {
  Menu,
  MenuCategory,
  MenuItem,
  MenuModifier,
} from "../menu-manager/helper/menu-types";

export const menuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMenu: builder.mutation<void, Partial<Menu>>({
      query: (newMenu) => ({
        url: "/menus",
        method: "POST",
        body: newMenu,
      }),
      invalidatesTags: [{ type: "Menus" }],
    }),
    updateMenu: builder.mutation<void, { menuId: number; name: string }>({
      query: ({ menuId, ...body }) => ({
        url: `/menus/${menuId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { menuId }) => [
        { type: "Menus", id: "LIST" },
        { type: "Menus", id: menuId },
      ],
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
    getMenuItems: builder.query<MenuItem[], string>({
      query: (menuId) => `/menus/${menuId}/items`,
      providesTags: (_result, _err, menuId) => [
        { type: "MenuItems", id: menuId },
      ],
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

    getPresignedUrl: builder.mutation<
      {
        method: string;
        url: string;
        key: string;
      },
      {
        fileName: string;
        fileType: string;
        path: string;
      }
    >({
      query: (payload) => ({
        url: "/menus/presigned-url",
        method: "PUT",
        body: payload,
      }),
    }),

    getCategoriesPresignedUrl: builder.mutation<
      {
        method: string;
        url: string;
        key: string;
      },
      {
        fileName: string;
        fileType: string;
        path: string;
      }
    >({
      query: (payload) => ({
        url: "/menu-categories/presigned-url",
        method: "PUT",
        body: payload,
      }),
    }),
    // syncMenuToUber: builder.mutation<void, any>({
    //   query: ({ id }) => ({
    //     url: `/menus/${id}/sync-to-uber`,
    //     method: "POST",
    //   }),
    //   invalidatesTags: [{ type: "Menus" }],
    // }),
    syncMenuToUber: builder.mutation<void, { id: string; storeIds: string[] }>({
      query: ({ id, storeIds }) => ({
        url: `/uber-eats/sync-menu/${id}`,
        method: "PUT",
        params: {
          storeIds: storeIds.join(","),
        },
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

    getAllModificationTypes: builder.query<
      { id: string; name: string; value: string }[],
      void
    >({
      query: () => "/menus/modification-types",
    }),

    duplicateMenu: builder.mutation<void, { menuId: string }>({
      query: ({ menuId }) => ({
        url: `/menus/${menuId}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Menus" }],
    }),

    deleteMenu: builder.mutation<void, { menuId: string }>({
      query: ({ menuId }) => ({
        url: `/menus/${menuId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Menus" }],
    }),
    deleteCategory: builder.mutation<
      void,
      { menuId: string; categoryId: string }
    >({
      query: ({ menuId, categoryId }) => ({
        url: `/menus/${menuId}/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { menuId }) => [
        { type: "MenuCategory", id: menuId },
        { type: "MenuItems", id: menuId },
        { type: "MenuModifiers" },
        { type: "Menus" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMenusQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useGetMenuByIdQuery,
  useGetMenuCategoriesQuery,
  useGetMenuItemsQuery,
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
  useGetAllModificationTypesQuery,
  useGetPresignedUrlMutation,
  useDuplicateMenuMutation,
  useDeleteMenuMutation,
  useDeleteCategoryMutation,
} = menuApi;
