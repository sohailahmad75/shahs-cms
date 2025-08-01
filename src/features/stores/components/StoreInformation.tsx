import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetStoreByIdQuery,
  useUpdateOpeningHoursMutation,
} from "../services/storeApi";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import StoreMap from "./StoreMap";
import { getFsaBadgeUrl } from "../helper/store-helper";
import { toast } from "react-toastify";
import OpeningHoursFormSection from "./OpeningHoursFormSection";

const StoreInformation = () => {
  const { id } = useParams();
  const { data: store, isLoading } = useGetStoreByIdQuery(id!);
  const [updateOpeningHours, { isLoading: updateOpeningHoursLoading }] =
    useUpdateOpeningHoursMutation();
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
    if (store?.openingHours) {
      const openingMap = Object.fromEntries(
        store.openingHours.map((h: any) => [h.day, h]),
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

  if (isLoading) return <Loader />;
  if (!store) return <div className="text-red-500 p-4">Store not found.</div>;

  return (
    <div className=" mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
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
                ["VAT Number", store.vatNumber || "-"],
              ]}
            />
          </Card>

          {/* Opening Hours */}
          <Card>
            <h2 className="font-semibold">Opening Hours</h2>
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
                onClick={async () => {
                  try {
                    await updateOpeningHours({
                      id: store.id,
                      data: openingHours,
                    }).unwrap();
                    toast.success("Store Opening hours updated successfully");
                  } catch (err: any) {
                    toast.error(err?.data?.message || "Error occurred");
                  }
                }}
              >
                Save Hours
              </Button>
            </div>
          </Card>

          {/* Bank Accounts */}
          <Card>
            <h2 className="text-lg font-semibold mb-3">Bank Accounts</h2>
            {store.bankDetails?.length === 0 ? (
              <p className="text-gray-500">No bank accounts available.</p>
            ) : (
              <ul className="space-y-3">
                {store.bankDetails.map((bank) => (
                  <li
                    key={bank.id}
                    className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-700"
                  >
                    <Detail label="Bank" value={bank.bankName} />
                    <Detail label="Account Number" value={bank.accountNumber} />
                    <Detail label="Sort Code" value={bank.sortCode} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="rounded-xl">
          {store.fsa && (
            <Card>
              <h2 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-3">
                FSA Food Hygiene Rating
              </h2>

              <div className="flex items-center gap-6 text-left">
                <img
                  src={getFsaBadgeUrl(store.fsa.rating)}
                  alt={`FSA Rating ${store.fsa.rating}`}
                  className="w-32 sm:w-36 md:w-60"
                />
                <div className="text-secondary-100">
                  <p className="text-lg font-semibold">{store.fsa.name}</p>
                  <p className="text-sm">
                    <strong>Address:</strong> {store.fsa.address}
                  </p>
                  <p className="text-xs ">
                    <strong>Rated on:</strong>{" "}
                    {new Date(store.fsa.ratingDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs ">
                    <strong>Authority:</strong> {store.fsa.authority}
                  </p>
                  <p className="text-xs ">
                    <strong>Status:</strong> {store.fsa.status}
                  </p>
                </div>
              </div>
            </Card>
          )}
          <StoreMap store={store} />
        </div>
      </div>
    </div>
  );
};

// Simple reusable card container
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow">
    {children}
  </div>
);

// Reusable grid layout for basic info
const GridDetail = ({ data }: { data: [string, string | undefined][] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
    {data.map(([label, value]) => (
      <Detail key={label} label={label} value={value} />
    ))}
  </div>
);

// One-line label-value pair
const Detail = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <strong className="text-secondary-100 dark:text-gray-300">{label}:</strong>{" "}
    <span className="text-secondary-100 dark:text-gray-100">{value}</span>
  </div>
);

export default StoreInformation;
