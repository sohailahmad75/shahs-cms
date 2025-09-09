import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useGetStoresQuery } from "../../stores/services/storeApi";
import SelectField from "../../../components/SelectField";
import type { CreateKioskDto, UpdateKioskDto } from "../kiosks.types";

const KioskSchema = Yup.object().shape({
  deviceId: Yup.string().required("Device ID is required"),
  storeId: Yup.string().nullable(),
  deviceType: Yup.number().oneOf([1, 2]).required("Device Type is required"),
});

const emptyInitialValues: CreateKioskDto = {
  deviceId: "",
  storeId: "",
  deviceType: 1, // Default to Self-Service
};

const KioskModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingKiosk,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateKioskDto | UpdateKioskDto) => void;
  editingKiosk: UpdateKioskDto | null | undefined;
  isSubmitting: boolean;
}) => {
  const { data: storesResp } = useGetStoresQuery({
    page: 1,
    perPage: 10,
    query: "",
  });
  const stores = storesResp?.data ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingKiosk ? "Edit Kiosk" : "Add Kiosk"}
      width="max-w-2xl"
    >
      <Formik
        initialValues={{
          ...emptyInitialValues,
          ...(editingKiosk
            ? {
                deviceId: editingKiosk.deviceId ?? "",
                storeId: editingKiosk.storeId ?? "",
                deviceType: editingKiosk.deviceType ?? 1,
              }
            : {}),
        }}
        validationSchema={KioskSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, handleChange, touched, errors }) => (
          <Form className="space-y-8">
            <div className="col-span-2 flex items-center gap-6 mb-6">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="text-orange-100 text-md font-medium whitespace-nowrap">
                Kiosk Details
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Device ID */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Device ID <span className="text-red-500"> *</span>
                </label>
                <InputField
                  name="deviceId"
                  placeholder="Device ID"
                  value={values.deviceId}
                  onChange={handleChange}
                  error={touched.deviceId ? (errors.deviceId as string) : ""}
                />
              </div>

              {/* Store (optional) */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Select Store
                </label>
                <SelectField
                  name="storeId"
                  value={values.storeId ?? ""}
                  onChange={handleChange}
                  options={[
                    ...stores.map((s) => ({ label: s.name, value: s.id })),
                  ]}
                  error={touched.storeId ? (errors.storeId as string) : ""}
                />
              </div>

              {/* Device Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Device Type <span className="text-red-500"> *</span>
                </label>
                <SelectField
                  name="deviceType"
                  value={values.deviceType}
                  onChange={handleChange}
                  options={[
                    { label: "Self-Service", value: 1 },
                    { label: "Till", value: 2 },
                  ]}
                  error={
                    touched.deviceType ? (errors.deviceType as string) : ""
                  }
                />
              </div>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              {editingKiosk ? "Update Kiosk" : "Create Kiosk"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default KioskModal;
