import React, { useState } from "react";
import Button from "../../components/Button";
import {
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} from "../../services/storeApi";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import { toast } from "react-toastify";
import type { Store } from "./types";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import {
  StoreTypeEnum,
  StoreTypeOptions,
} from "../../common/enums/status.enum";
import SelectField from "../../components/SelectField";

const emptyInitialValues = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  postcode: "",
  country: "United Kingdom",
  uberStoreId: "",
  deliverooStoreId: "",
  justEatStoreId: "",
  vatNumber: "",
  googlePlaceId: "",
  storeType: StoreTypeEnum.SHOP.toString(),
};

const StoreSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  postcode: Yup.string().required("Postcode is required"),
  country: Yup.string().required("Country is required"),
  storeType: Yup.string().required("Store type is required"),
});

const StoreListPage: React.FC = () => {
  const { data: stores = [], isLoading, refetch } = useGetStoresQuery();
  const [createStore] = useCreateStoreMutation();
  const [updateStore] = useUpdateStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStore(id).unwrap();
      toast.success("Store deleted");
      refetch();
    } catch (err: any) {
      toast.error("Failed to delete store");
    }
  };

  const columns: Column<Store>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "street", label: "Street" },
    { key: "postcode", label: "Postcode" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button variant="outlined" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Button
          onClick={() => {
            setEditingStore(null);
            setModalOpen(true);
          }}
        >
          Add Store
        </Button>
      </div>

      {isLoading ? (
        <p>Loading stores...</p>
      ) : (
        <DynamicTable
          data={stores}
          columns={columns}
          rowKey="id"
          tableClassName="bg-white dark:bg-slate-900"
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStore ? "Edit Store" : "Add Store"}
        width="max-w-4xl"
      >
        <Formik
          initialValues={editingStore || emptyInitialValues}
          validationSchema={StoreSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (editingStore) {
                await updateStore({
                  id: editingStore.id,
                  data: values,
                }).unwrap();
                toast.success("Store updated successfully");
              } else {
                await createStore(values).unwrap();
                toast.success("Store created successfully");
              }

              setModalOpen(false);
              setEditingStore(null);
              refetch();
            } catch (err: any) {
              toast.error(err?.data?.message || "Something went wrong");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "name", label: "Store Name", required: true },
                  { name: "email", label: "Email", required: true },
                  { name: "phone", label: "Phone", required: true },
                  { name: "street", label: "Street", required: true },
                  { name: "city", label: "City", required: true },
                  { name: "postcode", label: "Postcode", required: true },
                  { name: "country", label: "Country", required: true },
                  { name: "storeType", label: "Store Type", required: true }, // Include here
                  { name: "vatNumber", label: "VAT Number" },
                  { name: "googlePlaceId", label: "Google Place ID" },
                  { name: "uberStoreId", label: "Uber Store ID" },
                  { name: "deliverooStoreId", label: "Deliveroo Store ID" },
                  { name: "justEatStoreId", label: "Just Eat Store ID" },
                ].map(({ name, label, required }) => (
                  <div key={name}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {label}
                      {required && <span className="text-red-500"> *</span>}
                    </label>

                    {name === "storeType" ? (
                      <SelectField
                        name={name}
                        value={values[name]}
                        onChange={handleChange}
                        options={StoreTypeOptions}
                        error={touched[name] ? errors[name] : ""}
                      />
                    ) : (
                      <InputField
                        name={name}
                        placeholder={label}
                        value={values[name]}
                        onChange={handleChange}
                        error={touched[name] ? errors[name] : ""}
                      />
                    )}
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full" loading={isSubmitting}>
                {editingStore ? "Update Store" : "Create Store"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default StoreListPage;
