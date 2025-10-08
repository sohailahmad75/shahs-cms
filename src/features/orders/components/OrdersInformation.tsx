import { useParams } from "react-router-dom";
import { useGetOrderByIdQuery } from "../services/orderApi";
import Loader from "../../../components/Loader";
import { useTheme } from "../../../context/themeContext";
import type { CartItem, Modifier } from "../helpers/ordersHelpers";
import { renderTypeBadge } from "../../../components/statusBadge";

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
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
        }).format(amount);
    };

    const capitalizeFirst = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

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
                                ["Provider", renderTypeBadge(order.provider)],
                                ["Store ID", order.storeId],
                                ["Type", renderTypeBadge(order.type)],
                                ["Total Amount", formatCurrency(order.totalAmount)],
                                ["Placed At", new Date(order.placedAt).toLocaleString()],
                                ["Estimated Ready", new Date(order.estimatedReadyAt).toLocaleString()],
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>

                    `<Card isDarkMode={isDarkMode}>
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
                                                            value={`${capitalizeFirst(mod.modifierType)}`}
                                                            isDarkMode={isDarkMode}
                                                        />
                                                        <ul className="list-disc list-inside ml-4">
                                                            {mod.modifierOptions.map((opt) => (
                                                                <li key={opt.optionId}>
                                                                    Qty: {opt.quantity} - {formatCurrency(opt.totalPrice)}
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
                    </Card>`

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
    data: [string, React.ReactNode][];
    isDarkMode: boolean;
}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {data.map(([label, value]) => (
            <Detail key={label} label={label} value={value} isDarkMode={isDarkMode} />
        ))}
    </div>
);

const Detail = ({
    label,
    value,
    isDarkMode,
}: {
    label: string;
    value?: React.ReactNode;
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
