import React, { useState, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetMenuByIdQuery } from "../../services/menuApi";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import AddIcon from "../../assets/styledIcons/AddIcon";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";

interface Column {
  key: string;
  label: string;
  className: string;
  render: (value: any, row?: any) => JSX.Element;
}

const StoreList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const navigate = useNavigate();
  const { data: menu, isLoading } = useGetMenuByIdQuery(menuId);

  const [search, setSearch] = useState("");

  if (isLoading) return <Loader />;
  if (!menu) return <p>Menu not found</p>;

  const storeMenus = menu.storeMenus || [];

  const filteredStores = storeMenus.filter((sm) => {
    const store = sm.store || {};
    return (
      store.name?.toLowerCase().includes(search.toLowerCase()) ||
      store.email?.toLowerCase().includes(search.toLowerCase()) ||
      sm.storeId.toLowerCase().includes(search.toLowerCase())
    );
  });

  console.log("StoreMenus:", storeMenus);


  const columns: Column[] = [
    {
      key: "name",
      label: "Name",
      className: "text-left",
      render: (_: any, row: any) => (
        <span className="font-medium text-gray-800">{row.store?.name || `Store ${row.storeId}`}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      className: "text-left",
      render: (_: any, row: any) => (
        <span className="font-medium text-gray-800">{row.store?.email || "-"}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      className: "text-left",
      render: (_: any, row: any) => (
        <span className="font-medium text-gray-800">{row.store?.phone || "-"}</span>
      ),
    },
    {
      key: "companyName",
      label: "Company Name",
      className: "text-left",
      render: (_: any, row: any) => (
        <span className="font-medium text-gray-800">{row.store?.companyName || "-"}</span>
      ),
    },
    {
      key: "companyNumber",
      label: "Company Number",
      className: "text-left",
      render: (_: any, row: any) => (
        <span className="font-medium text-gray-800">{row.store?.companyNumber || "-"}</span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      className: "text-center",
      render: (_: any, row: any) => (
        <div className="flex justify-center items-center gap-2">
          <button className="text-blue-600 hover:text-blue-800" title="Edit">
            <EditIcon className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-800" title="Delete">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => navigate("/stores")} icon={<AddIcon />}>
          Add Stores
        </Button>
      </div>


      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-orange-500 hover:bg-orange-600 text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold ${col.className || "text-left"}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((row, idx) => (
              <tr key={row.storeId || idx} className="hover:bg-orange-50 transition">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 border-t border-gray-200">
                    {col.render(row[col.key], row)}
                  </td>
                ))}
              </tr>
            ))}
            {filteredStores.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreList;
