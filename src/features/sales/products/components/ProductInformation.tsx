import { useParams } from "react-router-dom";
import { useGetOneProductQuery } from "../services/productApi";
import Loader from "../../../../components/Loader";
import { useTheme } from "../../../../context/themeContext";
import StockIcon from "../../../../assets/styledIcons/StockIcon";
import NonStockIcon from "../../../../assets/styledIcons/NonStockIcon";
import ServiceIcon from "../../../../assets/styledIcons/ServiceIcon";

const ProductInformation = () => {
    const { id } = useParams();
    const { data: product, isLoading } = useGetOneProductQuery(id!);
    const { isDarkMode } = useTheme();

    if (isLoading) return <Loader />;
    if (!product)
        return (
            <div className={`p-4 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>
                Product not found.
            </div>
        );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
        }).format(amount);
    };

    const getProductTypeIcon = (type: string) => {
        switch (type) {
            case "stock":
                return <StockIcon className="w-5 h-5" />;
            case "non-stock":
                return <NonStockIcon className="w-5 h-5" />;
            case "service":
                return <ServiceIcon className="w-5 h-5" />;
            default:
                return null;
        }
    };

    const getProductTypeLabel = (type: string) => {
        switch (type) {
            case "stock":
                return "Stock Item";
            case "non-stock":
                return "Non-Stock Item";
            case "service":
                return "Service";
            default:
                return type;
        }
    };

    return (
        <div className={`mx-auto ${isDarkMode ? "bg-slate-950" : "bg-white"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">


                    <Card isDarkMode={isDarkMode}>
                        <h2 className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
                            Basic Information
                        </h2>
                        <GridDetail
                            data={[
                                ["Product ID", product.id],
                                ["Name", product.name],
                                ["Item Code", product.itemCode],
                                ["Product Type",
                                    <div className="flex items-center gap-2">
                                        {getProductTypeIcon(product.productType)}
                                        <span>{getProductTypeLabel(product.productType)}</span>
                                    </div>
                                ],
                                ["Category", product.category.name || "N/A"],
                                ["Status", product.isActive || "Active"],
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>


                    <Card isDarkMode={isDarkMode}>
                        <h2 className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
                            Measurement & Usage
                        </h2>
                        <GridDetail
                            data={[
                                ["Unit of Measure", product.uom ],
                                ["Usage", product.usage],
                                ["Initial Quantity", product.initialQuantity?.toString() || "0"],
                                ["Reorder Point", product.reorderPoint?.toString() || "N/A"],
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>


                    <Card isDarkMode={isDarkMode}>
                        <h2 className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
                            Pricing Information
                        </h2>
                        <GridDetail
                            data={[
                                ["Sales Price", product.salesPrice ? formatCurrency(product.salesPrice) : "N/A"],
                                ["Purchase Cost", product.purchaseCost ? formatCurrency(product.purchaseCost) : "N/A"],
                                ["Preferred Supplier", product.supplier?.name || "N/A"],
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>


                    <Card isDarkMode={isDarkMode}>
                        <h2 className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
                            Descriptions
                        </h2>
                        <div className="space-y-4">
                            {product.salesDescription && (
                                <Detail
                                    label="Sales Description"
                                    value={product.salesDescription}
                                    isDarkMode={isDarkMode}
                                />
                            )}
                            {product.purchaseDescription && (
                                <Detail
                                    label="Purchase Description"
                                    value={product.purchaseDescription}
                                    isDarkMode={isDarkMode}
                                />
                            )}
                            {!product.salesDescription && !product.purchaseDescription && (
                                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                                    No descriptions available
                                </p>
                            )}
                        </div>
                    </Card>


                    <Card isDarkMode={isDarkMode}>
                        <h2 className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
                            Timestamps
                        </h2>
                        <GridDetail
                            data={[
                                ["Created At", new Date(product.createdAt).toLocaleString()],
                                ["Updated At", new Date(product.updatedAt).toLocaleString()],
                            ]}
                            isDarkMode={isDarkMode}
                        />
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
            {value || "N/A"}
        </span>
    </div>
);

export default ProductInformation;