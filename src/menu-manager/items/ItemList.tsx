import React, { useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import { useGetMenuCategoriesQuery } from "../../services/menuApi";
import AddItemModal from "./AddItemModal";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import AddIcon from "../../assets/styledIcons/AddIcon";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";

interface Column {
  key: string;
  label: string;
  className: string;
  render: (value: any, row?: any) => JSX.Element;
}

interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

const StoresList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const { data: categories = [], isLoading } =
    useGetMenuCategoriesQuery(menuId);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddItem, setShowAddItem] = useState(false);

  const allItems: Item[] = categories.flatMap((category) =>
    category?.items?.map((item: any) => ({
      ...item,
      category: category.name,
    })) || []
  );

  const filtered = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ["All", ...new Set(categories.map((c) => c.name))];

  const columns: Column[] = [
    {
      key: "name",
      label: "Item",
      className: "text-left",
      render: (value: string, row: Item) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs text-gray-400">No Image</span>
            )}
          </div>
          <span className="font-medium text-gray-800">{value}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      className: "text-left",
      render: (value: number) => (
        <span className="text-gray-700">Rs {value.toFixed(2)}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "text-left",
      render: (value: string) => (
        <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      className: "text-center",
      render: (_value: any) => (
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

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 w-full">
        <div className="flex flex-col sm:flex-row flex-1 gap-3 w-full lg:max-w-[50%]">
          <InputField
            name="search"
            placeholder="Search for an item"
            value={search}
            className="w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SelectField
            name="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={uniqueCategories.map((cat) => ({
              label: cat,
              value: cat,
            }))}
          />
        </div>
        <div className="w-full lg:w-auto">
          <Button
            onClick={() => setShowAddItem(true)}
            className="w-full sm:w-auto"
            icon={<AddIcon />}
          >
            Add Item
          </Button>
        </div>
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
            {filtered.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="hover:bg-orange-50 transition"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 border-t border-gray-200"
                  >
                    {col.render(row[col.key as keyof Item], row)}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        categories={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
        selectedCategory={categories[0] || { id: "", name: "" }}
      />
    </div>
  );
};

export default StoresList;