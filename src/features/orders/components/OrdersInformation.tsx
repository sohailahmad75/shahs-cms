import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../services/orderApi";
import Loader from "../../../components/Loader";
import { useTheme } from "../../../context/themeContext";
import type { CartItem, Modifier } from "../helpers/ordersHelpers";

const OrderInformation = () => {
    const { id } = useParams();
    const { data: order, isLoading } = useGetOrderByIdQuery(id!);
    const { isDarkMode } = useTheme();

    if (isLoading) return <Loader />;
    if (!order)
        return (
            <div className={`p-4 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>
                Order not found.
            </div>
        );

    return (
        <div className={`mx-auto ${isDarkMode ? "bg-slate-950" : "bg-white"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Info */}
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            Order Information
                        </h2>
                        <GridDetail
                            data={[
                                ["Order ID", order.id],
                                ["Display ID", order.displayId],
                                ["Provider", order.provider],
                                ["Store ID", order.storeId],
                                ["Type", order.type],
                                ["Status", order.state],
                                ["Total Amount", `$${order.totalAmount}`],
                                ["Placed At", new Date(order.placedAt).toLocaleString()],
                                ["Estimated Ready", new Date(order.estimatedReadyAt).toLocaleString()],
                                [
                                    "Actual Ready",
                                    order.actualReadyAt
                                        ? new Date(order.actualReadyAt).toLocaleString()
                                        : "—",
                                ],
                                ["Created At", new Date(order.createdAt).toLocaleString()],
                                ["Updated At", new Date(order.updatedAt).toLocaleString()],
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>

                    {/* Customer Info */}
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            Customer Information
                        </h2>
                        <GridDetail
                            data={[
                                [
                                    "Name",
                                    `${order.customer.firstName} ${order.customer.lastName}`,
                                ],
                                ["Email", order.customer.email],
                                ["Phone", order.customer.phone],
                               
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>

                    {/* Cart Items */}
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            Cart Items
                        </h2>
                        {order.cart && order.cart.length > 0 ? (
                            <ul className="space-y-3">
                                {order.cart.map((item: CartItem) => (
                                    <li
                                        key={item.itemId}
                                        className={`border rounded-lg p-3 ${isDarkMode
                                                ? "bg-slate-700 border-slate-600"
                                                : "bg-slate-50 border-gray-200"
                                            }`}
                                    >
                                        <Detail
                                            label="Item"
                                            value={`${item.name} ($${item.price}) x ${item.quantity}`}
                                            isDarkMode={isDarkMode}
                                        />
                                        <Detail
                                            label="Final Price"
                                            value={`$${item.finalPrice}`}
                                            isDarkMode={isDarkMode}
                                        />

                                        {/* Modifiers */}
                                        {item.modifiers.length > 0 && (
                                            <div className="mt-2 ml-4">
                                                <h4
                                                    className={`font-medium ${isDarkMode ? "text-slate-200" : "text-gray-700"
                                                        }`}
                                                >
                                                    Modifiers
                                                </h4>
                                                {item.modifiers.map((mod: Modifier) => (
                                                    <div key={mod.modifierId} className="ml-3 mt-1">
                                                        <Detail
                                                            label="Modifier"
                                                            value={`${mod.modifierName} (${mod.modifierType})`}
                                                            isDarkMode={isDarkMode}
                                                        />
                                                        <ul className="list-disc list-inside ml-4">
                                                            {mod.modifierOptions.map((opt) => (
                                                                <li key={opt.optionId}>
                                                                    {opt.optionName} - Qty: {opt.quantity} - $
                                                                    {opt.totalPrice}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p
                                className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                            >
                                No cart items available.
                            </p>
                        )}
                    </Card>

                    {/* External References */}
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            External References
                        </h2>
                        {order.externalReferences && order.externalReferences.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {order.externalReferences.map((ref) => (
                                    <li key={ref.externalOrderId}>
                                        {ref.provider} - {ref.externalOrderId} ({ref.syncStatus})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p
                                className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                            >
                                No external references available.
                            </p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

const Card = ({
    children,
    isDarkMode,
}: {
    children: React.ReactNode;
    isDarkMode: boolean;
}) => (
    <div
        className={`p-5 rounded-lg shadow ${isDarkMode
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-gray-200"
            }`}
    >
        {children}
    </div>
);

const GridDetail = ({
    data,
    isDarkMode,
}: {
    data: [string, string | undefined | number | null][];
    isDarkMode: boolean;
}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {data.map(([label, value]) => (
            <Detail
                key={label}
                label={label}
                value={String(value ?? "")}
                isDarkMode={isDarkMode}
            />
        ))}
    </div>
);

const Detail = ({
    label,
    value,
    isDarkMode,
}: {
    label: string;
    value?: string;
    isDarkMode: boolean;
}) => (
    <div>
        <strong className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
            {label}:
        </strong>{" "}
        <span className={isDarkMode ? "text-slate-100" : "text-gray-800"}>
            {value}
        </span>
    </div>
);

export default OrderInformation;
