import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface CenterCoords {
  latitude: number;
  longitude: number;
}

interface LocationData {
  lat: number;
  lng: number;
  companyName?: string;
  isActive?: boolean;
  [key: string]: any;
}

interface AsyncLocationPreviewProps {
  data: LocationData[];
  center: CenterCoords;
  zoom?: number;
  setActive?: (location: LocationData) => void;
  [key: string]: any;
}

const LocationPreview: React.FC<AsyncLocationPreviewProps> = ({
  data,
  center,
  zoom: initialZoom = 14,
  setActive = () => {},
  ...props
}) => {
  const [zoom, setZoom] = useState(initialZoom);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_URL || "",
    libraries: ["places"],
  });

  useEffect(() => {
    setZoom(initialZoom);
  }, [center]);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      center={{
        lat: Number(center.latitude),
        lng: Number(center.longitude),
      }}
      zoom={zoom}
      mapContainerClassName="h-100 rounded-md overflow-hidden"
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        // styles: mapStyle,
      }}
      {...props}
    >
      {data?.map(({ lat, lng, companyName, isActive, ...rest }, index) => (
        <Marker
          key={`${lat}-${lng}-${index}`}
          position={{ lat: Number(lat), lng: Number(lng) }}
          label={{
            text: companyName || "",
            className: "text-xs font-semibold bg-white px-1 py-0.5 rounded",
          }}
          onClick={() =>
            setActive({ lat, lng, companyName, isActive, ...rest })
          }
        />
      ))}
    </GoogleMap>
  );
};

export default LocationPreview;
