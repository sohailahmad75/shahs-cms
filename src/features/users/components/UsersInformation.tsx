import { useParams } from "react-router-dom";
import {
    useGetUsersByIdQuery,
} from "../services/UsersApi";
import Loader from "../../../components/Loader";
import { useTheme } from "../../../context/themeContext";


const UsersInformation = () => {
    const { id } = useParams();
    const { data: Users, isLoading } = useGetUsersByIdQuery(id!);
    const { isDarkMode } = useTheme();

    if (isLoading) return <Loader />;
    if (!Users)
        return (
            <div
                className={`p-4 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
            >
                Users not found.
            </div>
        );
    const getRoleName = (role: number) => {
        switch (role) {
            case 1:
                return "Owner"
            case 3:
                return "Staff"
            default:
                return "Unknown"
        }
    }


    return (
        <div className={`mx-auto ${isDarkMode ? "bg-slate-950" : "bg-white"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">

                    <Card isDarkMode={isDarkMode}>
                        <GridDetail
                            data={[
                                ["First Name", Users.firstName],
                                ["Surname", Users.surName],
                                ["Email", Users.email],
                                ["Phone", String(Users.phone)],
                                ["Street", Users.street],
                                ["City", Users.city],
                                ["Postcode", Users.postCode],
                                [
                                    "Date of Birth",
                                    new Date(Users.dateOfBirth).toLocaleDateString(),
                                ],
                                ["Cash In Rate", Users.cashInRate],
                                ["NI Rate", Users.NiRate],
                                ["Share Code", Users.shareCode],
                                ["Role", getRoleName(Number(Users.role))],
                            ]}
                            isDarkMode={isDarkMode}
                        />
                    </Card>


                  
                    {Number(Users.role) !== 1 && (
                        <Card isDarkMode={isDarkMode}>
                            <h2
                                className={`font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                    }`}
                            >
                                Availability Hours
                            </h2>

                            {Users.availabilityHours && Users.availabilityHours.length > 0 ? (
                                <ul className="divide-y divide-gray-200 mt-3">
                                    {Users.availabilityHours.map((hour: any) => (
                                        <li
                                            key={hour.day}
                                            className={`flex justify-between py-2 ${isDarkMode ? "text-slate-200" : "text-gray-700"
                                                }`}
                                        >
                                            <span className="font-medium">{hour.day}</span>
                                            {hour.closed ? (
                                                <span className="italic text-red-500">Closed</span>
                                            ) : (
                                                <span>
                                                    {hour.open} - {hour.close}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                                    No opening hours available.
                                </p>
                            )}
                        </Card>
                    )}


                    
                    <Card isDarkMode={isDarkMode}>
                        <h2
                            className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"
                                }`}
                        >
                            Bank Accounts
                        </h2>
                        {Users.bankDetails?.length === 0 ? (
                            <p
                                className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                            >
                                No bank accounts available.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {Users.bankDetails.map((bank: any) => (
                                    <li
                                        key={bank.id}
                                        className={`border rounded-lg p-3 ${isDarkMode
                                            ? "bg-slate-700 border-slate-600"
                                            : "bg-slate-50 border-gray-200"
                                            }`}
                                    >
                                        <Detail
                                            label="Bank"
                                            value={bank.bankName}
                                            isDarkMode={isDarkMode}
                                        />
                                        <Detail
                                            label="Account Number"
                                            value={bank.accountNumber}
                                            isDarkMode={isDarkMode}
                                        />
                                        <Detail
                                            label="Sort Code"
                                            value={bank.sortCode}
                                            isDarkMode={isDarkMode}
                                        />
                                    </li>
                                ))}
                            </ul>
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

export default UsersInformation;