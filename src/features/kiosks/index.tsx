import React, { useState, useMemo } from "react";
import Button from "../../components/Button";
import {
  useGetKiosksQuery,
  useCreateKioskMutation,
  useUpdateKioskMutation,
  useDeleteKioskMutation,
  useGetKioskByIdQuery,
} from "./services/kiosksApi";
import {
  type Column,
  DynamicTable,
  type SortDir,
} from "../../components/DynamicTable";
import { toast } from "react-toastify";
import type { Kiosk, CreateKioskDto, UpdateKioskDto } from "./kiosks.types";
import Loader from "../../components/Loader";
import KioskModal from "./components/KioskModal";
import { Link } from "react-router-dom";
import EditIcon from "../../assets/styledIcons/EditIcon";
import ActionIcon from "../../components/ActionIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import EyeOpen from "../../assets/styledIcons/EyeOpen";
import Pagination from "../../components/Pagination";
import ConfirmDelete from "../../components/ConfirmDelete";
import FilterBar from "../../components/FilterBar";
import { kioskFiltersConfig } from "./helpers/kiosklist";
import DebouncedSearch from "../../components/DebounceSerach";

const KioskListPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKioskId, setEditingKioskId] = useState<string | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);

  // unified sort state for DynamicTable + API
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: SortDir;
  }>({
    key: null,
    direction: null,
  });

  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page, perPage };
    if (query) params.query = query;
    Object.entries(filters).forEach(
      ([key, value]) => value && (params[key] = value),
    );
    if (sortConfig.key && sortConfig.direction) {
      params.sort = sortConfig.key;
      params.sortDir = sortConfig.direction.toUpperCase(); // "ASC" | "DESC"
    }
    return params;
  }, [page, perPage, query, filters, sortConfig]);

  const {
    data: kiosksResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
    isFetching,
    refetch,
  } = useGetKiosksQuery(queryParams, { skip: !queryParams });

  const [createKiosk, { isLoading: creatingLoading }] =
    useCreateKioskMutation();
  const [updateKiosk, { isLoading: updateLoading }] = useUpdateKioskMutation();
  const [deleteKiosk] = useDeleteKioskMutation();

  const { data: editingKioskData } = useGetKioskByIdQuery(editingKioskId!, {
    skip: !editingKioskId,
  });

  const kiosks = kiosksResp.data;
  const meta = kiosksResp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const handleEdit = (id: string) => {
    setEditingKioskId(id);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteKiosk(id).unwrap();
    toast.success("Kiosk deleted");
    refetch();
  };

  const deviceTypeLabel = (t: number) => (t === 2 ? "Till" : "Self-Service");

  const columns: Column<Kiosk>[] = [
    {
      key: "index",
      label: "#",
      render: (_v, _row, index) => (
        <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
      ),
    },
    { key: "deviceId", label: "Device ID", sortable: true },
    {
      key: "deviceType",
      label: "Type",
      sortable: true,
      render: (v) => <span>{deviceTypeLabel(Number(v ?? 1))}</span>,
    },
    {
      key: "store",
      label: "Store",
      // use the field your API expects for sorting (e.g., "storeName" or "store.name")
      sortable: true,
      sortKey: "storeName",
      render: (_v, row) => <span>{row.store?.name ?? "—"}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_v, row) => (
        <div className="flex gap-2">
          <Link to={`/kiosks/${row.id}`} className="hover:underline">
            <ActionIcon
              className="text-secondary-100"
              icon={<EyeOpen size={22} />}
            />
          </Link>
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => handleEdit(row.id)}
          />
          <ConfirmDelete
            onConfirm={async () => handleDelete(row.id)}
            renderTrigger={({ open }) => (
              <ActionIcon
                className="text-red-500"
                icon={<TrashIcon size={22} />}
                onClick={open}
                title="Delete"
              />
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-xl font-bold">Kiosks</h1>
        <Button
          onClick={() => {
            setEditingKioskId(null);
            setModalOpen(true);
          }}
        >
          Add Kiosk
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* <InputField
            className="w-72"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search kiosks…"
            name="query"
          /> */}
          <DebouncedSearch
            value={query}
            onChange={(val) => setQuery(val)}
            delay={400}
            placeholder="Search kiosks…"
            className="w-100"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={kioskFiltersConfig as any}
          onApplyFilters={(applied) => {
            setFilters(applied);
            setPage(1);
          }}
          onClearAll={() => {
            setFilters({});
            setPage(1);
          }}
        />
      </div>

      {isLoading || isFetching ? (
        <Loader />
      ) : kiosks.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 text-center text-gray-600 bg-white">
          No kiosks found.
          {query || Object.keys(filters).length > 0 ? (
            <span className="block text-sm text-gray-500 mt-1">
              Try adjusting your search or filters.
            </span>
          ) : (
            <span className="block text-sm text-gray-500 mt-1">
              Click <strong>Add Kiosk</strong> to create your first one.
            </span>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-lg shadow-sm">
            <DynamicTable
              data={kiosks}
              columns={columns}
              rowKey="id"
              tableClassName="bg-white"
              sort={sortConfig}
              onSortChange={(next) => {
                setSortConfig(next);
                setPage(1);
              }}
            />
          </div>

          <Pagination
            className="mt-4"
            page={page}
            perPage={perPage}
            total={meta.total}
            onPageChange={(p) => setPage(p)}
            onPerPageChange={(pp) => {
              setPerPage(pp);
              setPage(1);
            }}
            perPageOptions={[10, 25, 50]}
          />
        </>
      )}

      <KioskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingKioskId(null);
        }}
        onSubmit={async (values: CreateKioskDto | UpdateKioskDto) => {
          if (editingKioskId) {
            await updateKiosk({ id: editingKioskId, data: values }).unwrap();
            toast.success("Kiosk updated successfully");
          } else {
            await createKiosk(values).unwrap();
            toast.success("Kiosk created successfully");
          }
          refetch();
          setModalOpen(false);
          setEditingKioskId(null);
        }}
        editingKiosk={editingKioskId ? editingKioskData : null}
        isSubmitting={creatingLoading || updateLoading}
      />
    </div>
  );
};

export default KioskListPage;
