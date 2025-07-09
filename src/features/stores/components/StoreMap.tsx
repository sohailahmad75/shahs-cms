import LocationPreview from "../../../components/LocationPreview";

const StoreMap = ({
  store = {
    id: "762fa1af-2011-465e-8361-fdac27238e43",
    name: "shahs",
    companyName: "Shahs halal food - Borough High Street",
    street: "135 Ramsay Road",
    city: "London",
    postcode: "E79EP",
    country: "United Kingdom",
    latitude: "51.5231",
    longitude: "-0.0931",
  },
}) => {
  if (!store?.latitude || !store?.longitude) return null;

  const center = {
    latitude: parseFloat(store.latitude),
    longitude: parseFloat(store.longitude),
  };

  const mapData = [
    {
      lat: parseFloat(store.latitude),
      lng: parseFloat(store.longitude),
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
