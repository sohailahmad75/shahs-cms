import  { useState } from "react";
import Button from "../../components/Button";
import { DynamicTable } from "../../components/DynamicTable";
import Loader from "../../components/Loader";
import InvoiceModal from "./components/InvoiceModal";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import ActionIcon from "../../components/ActionIcon";
import { useTheme } from "../../context/themeContext";
import Pagination from "../../components/Pagination";
import FilterBar from "../../components/FilterBar";
import { useServerTable } from "../../hooks/useServerTable";
import { toast } from "react-toastify";
import DebouncedSearch from "../../components/DebounceSerach";
import { invoiceFiltersConfig } from "./helpers/invoiceFilters";

const InvoiceListPage = () => {
  const { isDarkMode } = useTheme();
  const {
    query,
    setQuery,
    setFilters,
    clearFilters,
    page,
    perPage,
    onPerPageChange,
    sort,
    setSort,
    setPage,
    // queryParams,
  } = useServerTable();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
    
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingInvoice) {
       
        console.log("Updating invoice:", values);
        toast.success("Invoice updated successfully");
      } else {
       
        console.log("Creating invoice:", values);
        toast.success("Invoice created successfully");
      }

      setModalOpen(false);
      setEditingInvoice(null);
    
    } catch (error) {
      toast.error("Failed to save invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Invoice deleted successfully");
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  const columns = [
    {
      key: "index",
      label: "#",
      render: (_v, _row, index) => <span>{index + 1}</span>,
    },
    { key: "customer", label: "Customer", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "invoiceDate",
      label: "Invoice Date",
      sortable: true,
      render: (_, row) => row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString() : "-"
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (_, row) => row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-"
    },
    {
      key: "total",
      label: "Total",
      render: (_, row) => `£${row.items?.reduce((acc, item) => acc + (item.qty * item.rate), 0).toFixed(2) || "0.00"}`
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => {
              setEditingInvoice(row);
              setModalOpen(true);
            }}
            className={
              isDarkMode
                ? "text-slate-400 hover:text-slate-200"
                : "text-gray-500 hover:text-gray-700"
            }
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

  
  const sampleInvoices = [
    {
      id: 1,
      customer: "john",
      email: "john@example.com",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      items: [
        { product: "burger", description: "Deluxe Burger", qty: 2, rate: 12.99 }
      ]
    }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Invoices</h1>
        <Button
          onClick={() => {
            setEditingInvoice(null);
            setModalOpen(true);
          }}
        >
          Create Invoice
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DebouncedSearch
          value={query}
          onChange={(val) => setQuery(val)}
          delay={400}
          placeholder="Search invoices…"
          className="w-100"
        />
      </div>

     
      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={invoiceFiltersConfig}
          onApplyFilters={setFilters}
          onClearAll={clearFilters}
        />
      </div>

      {false ? ( 
        <Loader />
      ) : (
        <>
          <DynamicTable
            data={sampleInvoices}
            columns={columns}
            rowKey="id"
            tableClassName="bg-white"
            sort={sort}
            onSortChange={setSort}
          />

          <Pagination
            className="mt-4"
            page={page}
            perPage={perPage}
            total={sampleInvoices.length}
            onPageChange={setPage}
            onPerPageChange={onPerPageChange}
            perPageOptions={[10, 25, 50]}
          />
        </>
      )}

      <InvoiceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingInvoice(null);
        }}
        onSubmit={handleSubmit}
        editingInvoice={editingInvoice}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default InvoiceListPage;