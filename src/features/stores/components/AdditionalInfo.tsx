import React from "react";
import { useFormikContext } from "formik";
import InputField from "../../../components/InputField";

type StoreIntegrationInfoTypes = {
  googlePlaceId?: string;
  uberStoreId?: string;
  deliverooStoreId?: string;
  justEatStoreId?: string;
  fsaId?: string;
  lat?: string;
  lon?: string;
};

const StoreIntegrationInfoForm: React.FC = () => {
  const { values, handleChange, errors, touched } =
    useFormikContext<StoreIntegrationInfoTypes>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Google Place ID
        </label>
        <InputField
          name="googlePlaceId"
          placeholder="Google Place ID"
          value={values.googlePlaceId ?? ""}
          onChange={handleChange}
          error={touched.googlePlaceId ? (errors.googlePlaceId as string) : ""}
        />
      </div>

   
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Uber Eats Store ID
        </label>
        <InputField
          name="uberStoreId"
          placeholder="Uber Eats Store ID"
          value={values.uberStoreId ?? ""}
          onChange={handleChange}
          error={touched.uberStoreId ? (errors.uberStoreId as string) : ""}
        />
      </div>

   
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Deliveroo Store ID
        </label>
        <InputField
          name="deliverooStoreId"
          placeholder="Deliveroo Store ID"
          value={values.deliverooStoreId ?? ""}
          onChange={handleChange}
          error={
            touched.deliverooStoreId ? (errors.deliverooStoreId as string) : ""
          }
        />
      </div>

    
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Just Eat Store ID
        </label>
        <InputField
          name="justEatStoreId"
          placeholder="Just Eat Store ID"
          value={values.justEatStoreId ?? ""}
          onChange={handleChange}
          error={
            touched.justEatStoreId ? (errors.justEatStoreId as string) : ""
          }
        />
      </div>

    
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          FSA Store ID
        </label>
        <InputField
          name="fsaId"
          placeholder="FSA Store ID"
          value={values.fsaId ?? ""}
          onChange={handleChange}
          error={touched.fsaId ? (errors.fsaId as string) : ""}
        />
      </div>

     
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Google Place lat
        </label>
        <InputField
          name="lat"
          placeholder="Google Place lat"
          value={values.lat ?? ""}
          onChange={handleChange}
          error={touched.lat ? (errors.lat as string) : ""}
        />
      </div>

     
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Google Place lon
        </label>
        <InputField
          name="lon"
          placeholder="Google Place lon"
          value={values.lon ?? ""}
          onChange={handleChange}
          error={touched.lon ? (errors.lon as string) : ""}
        />
      </div>
    </div>
  );
};

export default React.memo(StoreIntegrationInfoForm);
