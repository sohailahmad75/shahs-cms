import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetStoreByIdQuery } from "../services/storeApi";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import InputField from "../../../components/InputField";
import StoreMap from "./StoreMap";

const StoreDetailPage = () => {
  const { id } = useParams();
  const { data: store, isLoading } = useGetStoreByIdQuery(id!);
  const [openingHours, setOpeningHours] = useState<string | null>("");

  console.log(store);
  useEffect(() => {
    if (store?.openingHours) setOpeningHours(store.openingHours);
  }, [store]);

  if (isLoading) return <Loader />;
  if (!store) return <div className="text-red-500 p-4">Store not found.</div>;

  const getFsaBadgeUrl = (rating: string) => {
    switch (rating) {
      case "5":
      case "4":
      case "3":
      case "2":
      case "1":
        return `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-${rating}.svg`;
      case "AwaitingInspection":
      case "Exempt":
      case "AwaitingPublication":
        return `https://ratings.food.gov.uk/images/badges/fhrs/1/fhrs-badge-${rating}.svg`;
      default:
        return null;
    }
  };

  return (
    <div className=" mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">{store.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Info */}
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
            <label className="block font-semibold mb-1">Opening Hours</label>
            <InputField
              name="opening-hours"
              value={openingHours || ""}
              onChange={(e) => setOpeningHours(e.target.value)}
              placeholder="e.g. Mon–Sun 11am–11pm"
            />
            <Button
              className="mt-3"
              onClick={() => alert("Update opening hours")}
            >
              Save Hours
            </Button>
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

export default StoreDetailPage;
