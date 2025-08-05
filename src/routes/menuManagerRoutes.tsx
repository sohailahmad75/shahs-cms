import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import MenuEditWrapper from "../menu-manager/categories/MenuEditWrapper";
import CategoryList from "../menu-manager/categories/CategoryList";
import MenuManager from "../menu-manager";
import ItemList from "../menu-manager/items/ItemList";
import ModifierList from "../menu-manager/modifications";

const menuManagerRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/menus",
        element: (
          <MainLayout>
            <MenuManager />
          </MainLayout>
        ),
      },
      {
        path: "/menus/:id/categories",
        element: (
          <MainLayout>
            <MenuEditWrapper>
              <CategoryList />
            </MenuEditWrapper>
          </MainLayout>
        ),
      },
      {
        path: "/menus/:id/items",
        element: (
          <MainLayout>
            <MenuEditWrapper>
              <ItemList />
            </MenuEditWrapper>
          </MainLayout>
        ),
      },
      {
        path: "/menus/:id/modifications",
        element: (
          <MainLayout>
            <MenuEditWrapper>
              <ModifierList />
            </MenuEditWrapper>
          </MainLayout>
        ),
      },
    ],
  },
];

export default menuManagerRoutes;
