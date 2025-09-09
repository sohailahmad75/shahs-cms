import { baseApi } from "./baseApi";
import type {
  Menu,
  MenuCategory,
  MenuItem,
  MenuModifier,
  UpdateMenuItemPayload,
} from "../menu-manager/menu.types";

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
    getMenuItems: builder.query<
      {
        data: MenuItem[];
        meta: {
          total: number;
          page: number;
          perPage: number;
          totalPages: number;
        };
      },
      {
        menuId: string;
        page?: number;
        perPage?: number;
        query?: string;
        categoryId?: string;
      }
    >({
      query: ({ menuId, ...params }) => ({
        url: `/menus/${menuId}/items`,
        params,
      }),
      providesTags: (_res, _err, { menuId }) => [
        { type: "MenuItems", id: menuId },
      ],
    }),

    // NEW: just id + name
    getMenuCategoryNames: builder.query<{ id: string; name: string }[], string>(
      {
        query: (menuId) => `/menus/${menuId}/categories-names`,
        providesTags: (_res, _err, menuId) => [
          { type: "MenuCategories", id: menuId },
        ],
      },
    ),
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

    updateMenuItem: builder.mutation<
      any,
      { menuId: string; itemId: string; payload: any }
    >({
      query: ({ menuId, itemId, payload }) => ({
        url: `/menus/${menuId}/items/${itemId}`,
        method: "PATCH",
        body: payload,
      }),
      // Optimistic patch so UI updates immediately
      async onQueryStarted(
        { menuId, itemId, payload },
        { dispatch, queryFulfilled },
      ) {
        const patch = dispatch(
          baseApi.util.updateQueryData(
            "getMenuItem",
            { menuId, itemId },
            (draft: any) => {
              if (!draft) return;

              // Patch base fields you edit in the form
              if (payload.name !== undefined) draft.name = payload.name;
              if (payload.description !== undefined)
                draft.description = payload.description;
              if (payload.price !== undefined) draft.price = payload.price;
              if (payload.deliveryPrice !== undefined)
                draft.deliveryPrice = payload.deliveryPrice;
              if (payload.categoryId !== undefined) {
                draft.categoryId = payload.categoryId;
                if (
                  draft.category &&
                  draft.category.id !== payload.categoryId
                ) {
                  // Optional: clear or update category.name later on re-fetch
                  draft.category.id = payload.categoryId;
                }
              }
              if (payload.s3Key !== undefined) draft.s3Key = payload.s3Key;

              // Reorder modifiers locally to reflect new order instantly
              if (
                Array.isArray(payload.modifiersOrder) &&
                payload.modifiersOrder.length &&
                Array.isArray(draft.modifiers)
              ) {
                const orderMap = new Map<string, number>();
                for (const { modifierId, order } of payload.modifiersOrder) {
                  orderMap.set(modifierId, order);
                }
                for (const m of draft.modifiers) {
                  const o = orderMap.get(m.id);
                  if (o !== undefined) {
                    // support both pivot shapes
                    if (!m.menuItemModifier) m.menuItemModifier = {};
                    m.menuItemModifier.order = o;
                    m.pivotOrder = o;
                  }
                }
                draft.modifiers.sort((a: any, b: any) => {
                  const ao = a.pivotOrder ?? a.menuItemModifier?.order ?? 0;
                  const bo = b.pivotOrder ?? b.menuItemModifier?.order ?? 0;
                  return ao - bo;
                });
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo(); // rollback on error
        }
      },

      // Also force a re-fetch to get canonical server state
      invalidatesTags: (_res, _err, { itemId }) => [
        { type: "MenuItem" as const, id: itemId },
      ],
    }),

    getMenuItem: builder.query<any, { menuId: string; itemId: string }>({
      query: ({ menuId, itemId }) => `/menus/${menuId}/items/${itemId}`, // your BE route
      providesTags: (_res, _err, { itemId }) => [
        { type: "MenuItem", id: itemId },
      ],
    }),

    deleteMenuItem: builder.mutation<void, { itemId: string; menuId?: string }>(
      {
        query: ({ itemId, menuId }) => ({
          url: `/menus/${menuId}/items/${itemId}`,
          method: "DELETE",
        }),
        invalidatesTags: (_res, _err, { menuId }) =>
          menuId
            ? [{ type: "MenuItems", id: menuId }]
            : [{ type: "MenuItems" }],
      },
    ),
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
    syncMenuToUber: builder.mutation<
      { message: string },
      { id: string; storeIds: string[] }
    >({
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
    deleteModifier: builder.mutation<
      { success: boolean; deletedOptions: number; deletedLinks: number },
      string
    >({
      query: (modifierId: string) => ({
        url: `/menus/modifiers/${modifierId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Modifiers", id: "LIST" }],
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

    updateMenuOrdering: builder.mutation<{ success: boolean }, any>({
      query: ({ menuId, ...body }) => ({
        url: `/menus/${menuId}/ordering`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Menus", id: arg.menuId },
        "Category",
        "Item",
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
  useGetMenuItemQuery,
  useGetMenuCategoriesQuery,
  useGetMenuItemsQuery,
  useGetMenuCategoryNamesQuery,
  useCreateCategoryMutation,
  useCreateItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useCreateModifierMutation,
  useGetModifiersQuery,
  useGetAllMenuItemsQuery,
  useUpdateModifierMutation,
  useGetModifierByIdQuery,
  useGenerateDefaultMenuMutation,
  useSyncMenuToUberMutation,
  useAssignMenuToManyStoresMutation,
  useGetAllModificationTypesQuery,
  useDeleteModifierMutation,
  useGetPresignedUrlMutation,
  useDuplicateMenuMutation,
  useDeleteMenuMutation,
  useDeleteCategoryMutation,
  useUpdateMenuOrderingMutation,
} = menuApi;
