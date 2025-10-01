import React from "react";
import {
    useGetOrdersQuery,
} from "./services/orderApi";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import type { Order } from "./helpers/ordersHelpers";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import EyeOpen from "../../assets/styledIcons/EyeOpen";
import Pagination from "../../components/Pagination";
import { useTheme } from "../../context/themeContext";
import FilterBar from "../../components/FilterBar";
import { orderFiltersConfig } from "./helpers/ordersFilters";
import { useServerTable } from "../../hooks/useServerTable";
import ActionIcon from "../../components/ActionIcon";
import { formatOrderDate } from "../../components/helper/dateFormat";
import DebouncedSearch from "../../components/DebounceSerach";

const OrderListPage: React.FC = () => {
    const { isDarkMode } = useTheme();
    const {
        query,
        setQuery,
        setPage,
        setFilters,
        clearFilters,
        page,
        perPage,
        onPerPageChange,
        sort,
        setSort,
        queryParams,
    } = useServerTable();

    const {
        data: ordersResp = {
            data: [],
            meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
        },
        isLoading,
    } = useGetOrdersQuery(queryParams);

    const orders = ordersResp.data;
    const meta = ordersResp.meta;
    const apiPageIndexBase = (meta.page - 1) * meta.perPage;

    const columns: Column<Order>[] = [
        {
            key: "index",
            label: "#",
            render: (_v, _row, index) => (
                <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
            ),
        },
        { key: "displayId", label: "Order Number", sortable: true },
        // {
        //     key: "customer",
        //     label: "Email",
        //     render: (_, row) => <span>{row.customer.email}</span>,
        // },
        { key: "provider", label: "Provider", sortable: true },
        {
            key: "totalAmount",
            label: "Total Amount",
            sortable: true,
            render: (value) => {
                if (typeof value === "number") {
                    return new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                    }).format(value);
                }
                return "£0.00";
            }
        },

        {
            key: "createdAt",
            label: "Order Date",
            sortable: true,
            render: (value) =>
                typeof value === "string" ? formatOrderDate(value) : "",
        },

        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, row) => (
                <div className="flex gap-2">
                    <Link to={`/orders/${row.id}`} className="hover:underline">
                        <ActionIcon
                            className={isDarkMode ? "text-white" : "text-secondary-100"}
                            icon={<EyeOpen size={22} />}
                            title="View Order"
                        />
                    </Link>
                </div>
            ),
        },
    ]


    return (
        <div className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <h1 className="text-xl font-bold">Orders</h1>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <DebouncedSearch
                    value={query}
                    onChange={(val) => setQuery(val)}
                    delay={400}
                    placeholder="Search orders…"
                    className="w-100"
                />
            </div>

            <div className="mb-8 mt-8">
                <FilterBar
                    filtersConfig={orderFiltersConfig as any}
                    onApplyFilters={setFilters}
                    onClearAll={clearFilters}
                />
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="rounded-lg shadow-sm">
                        <DynamicTable
                            data={orders}
                            columns={columns}
                            rowKey="id"
                            tableClassName="bg-white"
                            sort={sort}
                            onSortChange={setSort}
                        />
                    </div>

                    <Pagination
                        className="mt-4"
                        page={page}
                        perPage={perPage}
                        total={meta.total}
                        onPageChange={setPage}
                        onPerPageChange={onPerPageChange}
                        perPageOptions={[10, 25, 50]}
                    />
                </>
            )}
        </div>
    );
};

export default OrderListPage;