import React from "react";
import {
    useGetAllOrdersStoreQuery,
} from "./services/orderStoreAPI";
import { type Column, DynamicTable } from "../../../components/DynamicTable";
import type { OrderStore } from "./helpers/orderStoreHelpers";
import Loader from "../../../components/Loader";
import { Link } from "react-router-dom";
import EyeOpen from "../../../assets/styledIcons/EyeOpen";
import Pagination from "../../../components/Pagination";
import { useTheme } from "../../../context/themeContext";
import FilterBar from "../../../components/FilterBar";
import { orderStoreConfig } from "./helpers/orderFilters";
import { useServerTable } from "../../../hooks/useServerTable";
import ActionIcon from "../../../components/ActionIcon";
import { formatOrderDate } from "../../../components/helper/dateFormat";
import DebouncedSearch from "../../../components/DebounceSerach";

const StoreOrdersListPage: React.FC = () => {
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
    } = useGetAllOrdersStoreQuery(queryParams);

    const orders = ordersResp.data;
    const meta = ordersResp.meta;
    const apiPageIndexBase = (meta.page - 1) * meta.perPage;


    const calculateTotalAmount = (order: OrderStore): number => {
        return order.items.reduce((total, item) => {
            return total + (parseFloat(item.quantity) * parseFloat(item.unitPrice));
        }, 0);
    };

    const getDisplayId = (order: OrderStore): string => {
        return order.displayId || `SO-${order.id.slice(-8).toUpperCase()}`;
    };

    const columns: Column<OrderStore>[] = [
        {
            key: "index",
            label: "#",
            render: (_v, _row, index) => (
                <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
            ),
        },
        {
            key: "displayId",
            label: "Order Number",
            sortable: true,
            render: (_, order) => getDisplayId(order)
        },
        {
            key: "statusId",
            label: "Status",
            sortable: true,
            render: (statusId) => {
                const statusMap: { [key: number]: string } = {
                    1: "Pending",
                    2: "Processing",
                    3: "Completed",
                    4: "Cancelled"
                };
                return statusMap[statusId as number] || "Unknown";
            }
        },
        {
            key: "totalAmount",
            label: "Total Amount",
            sortable: true,
            render: (_, order) => {
                const total = calculateTotalAmount(order);
                return new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                }).format(total);
            }
        },
        {
            key: "itemCount",
            label: "Items",
            sortable: false,
            render: (_, order) => order.items.length
        },
        {
            key: "requestedDeliveryDate",
            label: "Delivery Date",
            sortable: true,
            render: (value) =>
                typeof value === "string" ? formatOrderDate(value) : "",
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
            render: (_, order) => (
                <div className="flex gap-2">
                    <Link to={`/store-orders/${order.id}`} className="hover:underline">
                        <ActionIcon
                            className={isDarkMode ? "text-white" : "text-secondary-100"}
                            icon={<EyeOpen size={22} />}
                            title="View Order Details"
                        />
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <h1 className="text-xl font-bold">Store Orders</h1>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <DebouncedSearch
                    value={query}
                    onChange={(val) => setQuery(val)}
                    delay={400}
                    placeholder="Search store orders…"
                    className="w-100"
                />
            </div>

            <div className="mb-8 mt-8">
                <FilterBar
                    filtersConfig={orderStoreConfig as any}
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

export default StoreOrdersListPage;