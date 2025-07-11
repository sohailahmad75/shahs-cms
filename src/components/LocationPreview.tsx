import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import shahsIcon from "../assets/images/shahs-logo-icon.png";

interface CenterCoords {
  lat: number;
  lon: number;
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
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_URL || "",
    libraries: ["places"],
  });

  useEffect(() => setZoom(initialZoom), [center]);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      center={{ lat: +center.lat, lng: +center.lon }}
      zoom={zoom}
      mapContainerClassName="h-100 rounded-md overflow-hidden"
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
      {...props}
    >
      {data?.map(({ lat, lng, companyName, isActive, ...rest }, idx) => (
        <Marker
          key={`${lat}-${lng}-${idx}`}
          position={{ lat: +lat, lng: +lng }}
          icon={{
            url: shahsIcon,
            anchor: new window.google.maps.Point(17, 17),
          }}
          onClick={() => {
            setActiveMarker(idx);
            setActive({ lat, lng, companyName, isActive, ...rest });
          }}
        >
          {activeMarker === idx && (
            <InfoWindow
              onCloseClick={() => setActiveMarker(null)}
              position={{ lat: +lat, lng: +lng }}
            >
              <div className="text-sm text-gray-800 dark:text-gray-200 space-y-1 max-w-xs">
                <div className="font-semibold text-base">
                  {companyName || "Unnamed Store"}
                </div>

                {rest.name && (
                  <div>
                    <span className="font-medium">Store Name:</span> {rest.name}
                  </div>
                )}

                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`${
                      isActive ? "text-green-600" : "text-red-500"
                    } font-semibold`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {rest.city && rest.street && (
                  <div>
                    <span className="font-medium">Address:</span> {rest.street},{" "}
                    {rest.city}
                  </div>
                )}

                {rest.phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {rest.phone}
                  </div>
                )}

                {rest.email && (
                  <div>
                    <span className="font-medium">Email:</span> {rest.email}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
};

export default LocationPreview;
