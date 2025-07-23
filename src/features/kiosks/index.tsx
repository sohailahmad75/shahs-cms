import React, { useState } from "react";
import Button from "../../components/Button";
import {
  useGetKiosksQuery,
  useCreateKioskMutation,
  useUpdateKioskMutation,
  useDeleteKioskMutation,
  useGetKioskByIdQuery,
} from "./services/kiosksApi";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import { toast } from "react-toastify";
import type { Kiosk } from "./types";
import Loader from "../../components/Loader";
import KioskModal from "./components/KioskModal";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import ActionIcon from "../../components/ActionIcon";
import StatusTag from "../../components/StatusTag";

const KiosksListPage: React.FC = () => {
  const { data: kiosks = [], isLoading, refetch } = useGetKiosksQuery();
  const [createKiosk, { isLoading: creating }] = useCreateKioskMutation();
  const [updateKiosk, { isLoading: updating }] = useUpdateKioskMutation();
  const [deleteKiosk] = useDeleteKioskMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingKioskId, setEditingKioskId] = useState<string | null>(null);
  const { data: editingKioskData } = useGetKioskByIdQuery(editingKioskId!, {
    skip: !editingKioskId,
  });

  const handleEdit = (id: string) => {
    setEditingKioskId(id);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKiosk(id).unwrap();
      toast.success("Kiosk deleted");
      refetch();
    } catch (err: any) {
      toast.error("Failed to delete kiosk");
    }
  };

  const columns: Column<Kiosk>[] = [
    {
      key: "index",
      label: "#",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    { key: "name", label: "Name" },
    { key: "model", label: "Model" },
    { key: "deviceId", label: "Device ID" },
    {
      key: "status",
      label: "Status",
      render: (_, row) => <StatusTag status={row.status} />,
    },
    {
      key: "storeId",
      label: "Store",
      render: (_, row) => <span>{row?.store?.name ?? "-"}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => handleEdit(row.id)}
          />
          <ActionIcon
            className="text-red-500"
            icon={<TrashIcon size={22} />}
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kiosks</h1>
        <Button
          onClick={() => {
            setEditingKioskId(null);
            setModalOpen(true);
          }}
        >
          Add Kiosk
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <DynamicTable
          data={kiosks}
          columns={columns}
          rowKey="id"
          tableClassName="bg-white dark:bg-slate-900"
        />
      )}

      <KioskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingKioskId(null);
        }}
        onSubmit={async (values) => {
          try {
            if (editingKioskId) {
              await updateKiosk({ id: editingKioskId, data: values }).unwrap();
              toast.success("Kiosk updated");
            } else {
              await createKiosk(values).unwrap();
              toast.success("Kiosk created");
            }
            refetch();
            setModalOpen(false);
            setEditingKioskId(null);
          } catch (err: any) {
            toast.error(err?.data?.message || "Error occurred");
          }
        }}
        editingKiosk={editingKioskId ? editingKioskData : null}
        isSubmitting={creating || updating}
      />
    </div>
  );
};

export default KiosksListPage;
