import { useParams } from "react-router-dom";
import { useGetOneSupplierQuery } from "../services/SupplierApi";
import Loader from "../../../../components/Loader";
import { useTheme } from "../../../../context/themeContext";

const SupplierInformation = () => {
    const { id } = useParams();
    const { data: supplier, isLoading } = useGetOneSupplierQuery(id!);
    const { isDarkMode } = useTheme();

    if (isLoading) return <Loader />;
    if (!supplier)
        return (
            <div className={`p-4 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>
                Supplier not found.
            </div>
        );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: supplier.currency || "GBP",
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div className={`mx-auto ${isDarkMode ? "bg-slate-950" : "bg-white"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            Basic Information
                        </h2>
                        <GridDetail
                            data={[
                                ["Supplier ID", supplier.id],
                                ["Name", supplier.name],
                                ["Contact Person", supplier.contactPerson],
                                ["Email", supplier.email],
                                ["Phone", supplier.phone],
                                ["Status", supplier.status],
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>

                 
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            Address Information
                        </h2>
                        <Detail
                            label="Address"
                            value={supplier.address}
                            isDarkMode={isDarkMode}
                        />
                        {supplier.website && (
                            <Detail
                                label="Website"
                                value={
                                    <a
                                        href={supplier.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`underline ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                                    >
                                        {supplier.website}
                                    </a>
                                }
                                isDarkMode={isDarkMode}
                            />
                        )}
                    </Card>

                
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            Financial Information
                        </h2>
                        <GridDetail
                            data={[
                                ["Currency", supplier.currency],
                                ["Current Balance", formatCurrency(supplier.balance)],
                                ["Payment Terms", `${supplier.paymentTerms} days`],
                                ["Taxable", supplier.isTaxable ? "Yes" : "No"],
                                ["Default VAT Rate", formatPercentage(supplier.defaultVatRate)],
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>

                   
                    {(supplier.taxNumber || supplier.bankDetails || supplier.notes) && (
                        <Card isDarkMode={isDarkMode}>
                            <h2
                                className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                    }`}
                            >
                                Additional Information
                            </h2>
                            <div className="space-y-4">
                                {supplier.taxNumber && (
                                    <Detail
                                        label="Tax Number"
                                        value={supplier.taxNumber}
                                        isDarkMode={isDarkMode}
                                    />
                                )}
                                {supplier.bankDetails && (
                                    <Detail
                                        label="Bank Details"
                                        value={supplier.bankDetails}
                                        isDarkMode={isDarkMode}
                                    />
                                )}
                                {supplier.notes && (
                                    <Detail
                                        label="Notes"
                                        value={supplier.notes}
                                        isDarkMode={isDarkMode}
                                    />
                                )}
                            </div>
                        </Card>
                    )}

                   
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`font-semibold text-lg mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            Timestamps
                        </h2>
                        <GridDetail
                            data={[
                                ["Created At", new Date(supplier.createdAt).toLocaleString()],
                                ["Updated At", new Date(supplier.updatedAt).toLocaleString()],
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
            {value}
        </span>
    </div>
);

export default SupplierInformation;