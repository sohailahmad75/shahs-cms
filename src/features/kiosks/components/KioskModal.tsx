import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useGetStoresQuery } from "../../stores/services/storeApi";
import SelectField from "../../../components/SelectField";
import type { CreateKioskDto, Kiosk, UpdateKioskDto } from "../kiosks.types";

const KioskSchema = Yup.object().shape({
  deviceId: Yup.string().required("Device ID is required"),
  storeId: Yup.string().nullable(),
});

const emptyInitialValues: CreateKioskDto = {
  deviceId: "",
  storeId: "",
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
  editingKiosk: Kiosk | null;
  isSubmitting: boolean;
}) => {
  const { data: stores = [], isLoading } = useGetStoresQuery();
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
          ...editingKiosk,
          status: editingKiosk?.status ?? 1,
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
              {[
                { name: "deviceId", label: "Device ID", required: true },
                { name: "storeId", label: "Select Store" },
              ].map(({ name, label, required }) => (
                <div key={name}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                  </label>

                  {name === "storeId" ? (
                    <SelectField
                      name={name}
                      value={values[name].toString()}
                      onChange={handleChange}
                      options={stores.map((s) => ({
                        label: s.name,
                        value: s.id,
                      }))}
                      error={touched[name] ? errors[name] : ""}
                    />
                  ) : (
                    <InputField
                      name={name}
                      placeholder={label}
                      value={
                        values[name as keyof typeof values]?.toString() ?? ""
                      }
                      onChange={handleChange}
                      error={
                        touched[name as keyof typeof touched]
                          ? (errors[name as keyof typeof errors] as string)
                          : ""
                      }
                    />
                  )}
                </div>
              ))}
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
