import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import ListReports from "../features/dailyReports/ListReports";
import ReportDetails from "../features/dailyReports/ReportDetails";
import CreateReport from "../features/dailyReports/CreateReport";

const reportRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["admin", "superadmin"]} />,
    children: [
      {
        path: "/reports",
        element: (
          <MainLayout>
            <ListReports />
          </MainLayout>
        ),
      },
      {
        path: "/reports/create",
        element: (
          <MainLayout>
            <CreateReport />
          </MainLayout>
        ),
      },
      {
        path: "/reports/:id",
        element: (
          <MainLayout>
            <ReportDetails />
          </MainLayout>
        ),
      },
    ],
  },
];

export default reportRoutes;
