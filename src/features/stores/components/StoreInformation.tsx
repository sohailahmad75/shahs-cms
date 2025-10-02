import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetStoreByIdQuery,
  useUpdateOpeningHoursMutation,
} from "../services/storeApi";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
// import StoreMap from "./StoreMap";
// import { getFsaBadgeUrl } from "../helper/store-helper";
import OpeningHoursFormSection from "./OpeningHoursFormSection";
import { useTheme } from "../../../context/themeContext";

const StoreInformation = () => {
  const { id } = useParams();
  const { data: store, isLoading, refetch } = useGetStoreByIdQuery(id!);
  const [updateOpeningHours, { isLoading: updateOpeningHoursLoading }] =
    useUpdateOpeningHoursMutation();
  const { isDarkMode } = useTheme();
  const defaultHours = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [sameAllDays, setSameAllDays] = useState(false);
  const [openingHours, setOpeningHours] = useState(
    defaultHours.map((day) => ({
      day,
      open: "11:00 am",
      close: "11:00 pm",
      closed: false,
    })),
  );

  useEffect(() => {
    if (store?.availabilityHour || store?.storeAvailability) {
      const availabilityData = store.storeAvailability || store.availabilityHour;

      const openingMap = Object.fromEntries(
        availabilityData.map((h: any) => [h.day, h])
      );

      setOpeningHours(
        defaultHours.map((day) => ({
          day,
          open: openingMap[day]?.open || "11:00 am",
          close: openingMap[day]?.close || "11:00 pm",
          closed: openingMap[day]?.closed ?? false,
        })),
      );
    }
  }, [store]);

  const handleSaveOpeningHours = async () => {
    try {
      const transformedData = openingHours.map((hour) => ({
        day: hour.day,
        open: hour.closed ? null : hour.open,
        close: hour.closed ? null : hour.close,
        closed: hour.closed,
      }));
      await updateOpeningHours({
        id: store.id,
        data: { storeAvailability: transformedData },
      }).unwrap();

      refetch(); 
    } catch (err: any) {
      console.error("Failed to update opening hours:", err);
    }
  };

  if (isLoading) return <Loader />;
  if (!store) return <div className={`p-4 ${isDarkMode ? "text-red-400" : "text-red-500"}`}>Store not found.</div>;

  return (
    <div className={`mx-auto ${isDarkMode ? "bg-slate-950" : "bg-white"} `}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card isDarkMode={isDarkMode}>
            <GridDetail
              data={[
                ["Email", store.email],
                ["Phone", store.phone],
                ["Street", store.street],
                ["City", store.city],
                ["Postcode", store.postcode],
                ["Country", store.country],
                ["Company Name", store.companyName],
                ["Company Number", store.companyNumber],
              ]}
              isDarkMode={isDarkMode}
            />
          </Card>

          <Card isDarkMode={isDarkMode}>
            <h2 className={`font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>Opening Hours</h2>
            <OpeningHoursFormSection
              openingHours={openingHours}
              setOpeningHours={setOpeningHours}
              sameAllDays={sameAllDays}
              setSameAllDays={setSameAllDays}
            />

            <div className="flex gap-3 mt-4 flex-end justify-end">
              <Button
                loading={updateOpeningHoursLoading}
                disabled={updateOpeningHoursLoading}
                onClick={handleSaveOpeningHours}
              >
                Save Hours
              </Button>
            </div>
          </Card>

          <Card isDarkMode={isDarkMode}>
            <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>Bank Accounts</h2>
            {store.bankDetails?.length === 0 ? (
              <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>No bank accounts available.</p>
            ) : (
              <ul className="space-y-3">
                {store.bankDetails.map((bank) => (
                  <li
                    key={bank.id}
                    className={`border rounded-lg p-3 ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-gray-200"
                      }`}
                  >
                    <Detail label="Bank" value={bank.bankName} isDarkMode={isDarkMode} />
                    <Detail label="Account Number" value={bank.accountNumber} isDarkMode={isDarkMode} />
                    <Detail label="Sort Code" value={bank.sortCode} isDarkMode={isDarkMode} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* <div className="rounded-xl">
          {store.fsa && (
            <Card isDarkMode={isDarkMode}>
              <h2 className={`text-lg font-semibold mb-3 border-b pb-3 ${isDarkMode ? "text-slate-100 border-slate-600" : "text-gray-800 border-gray-200"
                }`}>
                FSA Food Hygiene Rating
              </h2>

              <div className="flex items-center gap-6 text-left">
                <img
                  src={getFsaBadgeUrl(store.fsa.rating)}
                  alt={`FSA Rating ${store.fsa.rating}`}
                  className="w-32 sm:w-36 md:w-60"
                />
                <div className={isDarkMode ? "text-slate-300" : "text-gray-700"}>
                  <p className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>{store.fsa.name}</p>
                  <p className="text-sm">
                    <strong className={isDarkMode ? "text-slate-300" : "text-gray-700"}>Address:</strong>{" "}
                    <span className={isDarkMode ? "text-slate-100" : "text-gray-800"}>{store.fsa.address}</span>
                  </p>
                  <p className="text-xs">
                    <strong className={isDarkMode ? "text-slate-300" : "text-gray-700"}>Rated on:</strong>{" "}
                    <span className={isDarkMode ? "text-slate-100" : "text-gray-800"}>
                      {new Date(store.fsa.ratingDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-xs">
                    <strong className={isDarkMode ? "text-slate-300" : "text-gray-700"}>Authority:</strong>{" "}
                    <span className={isDarkMode ? "text-slate-100" : "text-gray-800"}>{store.fsa.authority}</span>
                  </p>
                  <p className="text-xs">
                    <strong className={isDarkMode ? "text-slate-300" : "text-gray-700"}>Status:</strong>{" "}
                    <span className={isDarkMode ? "text-slate-100" : "text-gray-800"}>{store.fsa.status}</span>
                  </p>
                </div>
              </div>
            </Card>
          )}
          <StoreMap store={store} />
        </div> */}
      </div>
    </div>
  );
};

const Card = ({ children, isDarkMode }: { children: React.ReactNode; isDarkMode: boolean }) => (
  <div className={`p-5 rounded-lg shadow ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
    }`}>
    {children}
  </div>
);

const GridDetail = ({ data, isDarkMode }: { data: [string, string | undefined][]; isDarkMode: boolean }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
    {data.map(([label, value]) => (
      <Detail key={label} label={label} value={value} isDarkMode={isDarkMode} />
    ))}
  </div>
);

const Detail = ({ label, value, isDarkMode }: { label: string; value?: string; isDarkMode: boolean }) => (
  <div>
    <strong className={isDarkMode ? "text-slate-300" : "text-gray-700"}>{label}:</strong>{" "}
    <span className={isDarkMode ? "text-slate-100" : "text-gray-800"}>{value || "N/A"}</span>
  </div>
);

export default StoreInformation;