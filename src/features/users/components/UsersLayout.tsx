import { useParams } from "react-router-dom";
import TabbedPageLayout from "../../../components/TabbedPageLayout";
import { useGetUsersByIdQuery } from "../services/UsersApi";
import Loader from "../../../components/Loader";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";

const UsersLayout = () => {
    const { id } = useParams();
    const { data: Users, isLoading } = useGetUsersByIdQuery(id!);
    const tabs = useMemo(
        () => [
            { label: "Users Information", path: `/users/${id}` },
            { label: "Users Documents", path: `/users/${id}/documents` },

        ],
        [id],
    );

    if (isLoading) return <Loader />;
    if (!Users) return <div className="text-red-500 p-4">User not found.</div>;

    return (
        <TabbedPageLayout title={`${Users.firstName} ${Users.surName}`}
            tabs={tabs}>
            <Outlet />
        </TabbedPageLayout>
    );
};

export default UsersLayout;
