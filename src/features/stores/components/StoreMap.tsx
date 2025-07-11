import LocationPreview from "../../../components/LocationPreview";

const StoreMap = ({
  store = {
    id: "762fa1af-2011-465e-8361-fdac27238e43",
    name: "Shahs Halal Food - Head Office",
    companyName: "Shahs Halal Food LTD",
    street: "Rosslyn Cres",
    city: "Harrow",
    postcode: "HA1 2RZ",
    country: "United Kingdom",
    lat: "51.587832749045965",
    lon: "-0.32885417955580487",
  },
}) => {
  if (!store?.lat || !store?.lon) return null;

  const center = {
    lat: parseFloat(store.lat),
    lon: parseFloat(store.lon),
  };

  const mapData = [
    {
      lat: parseFloat(store.lat),
      lng: parseFloat(store.lon),
      companyName: store.companyName || store.name,
      isActive: true,
    },
  ];

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden mt-4">
      <LocationPreview data={mapData} center={center} />
    </div>
  );
};

export default StoreMap;
