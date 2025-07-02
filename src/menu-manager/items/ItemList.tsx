import React, { useState } from "react";
import { DETAILED_MENU } from "../constants/detailedMenu";
import { DynamicTable } from "../../components/DynamicTable";

const columns: Column<MenuItem>[] = [
  {
    key: "name",
    label: "Name",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <img
          src={row.image}
          alt={row.name}
          className="w-10 h-10 rounded object-cover"
        />
        <span>{value}</span>
      </div>
    ),
  },
  { key: "price", label: "Price" },
  {
    key: "category",
    label: "Category",
    render: (value) => (
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
        {value}
      </span>
    ),
  },
  { key: "type", label: "Item Type" },
  {
    key: "id",
    label: "Actions",
    render: () => (
      <button className="text-gray-500 hover:text-black ml-auto">•••</button>
    ),
  },
];
const ItemList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const allItems: MenuItem[] = DETAILED_MENU.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.name,
    })),
  );

  const filtered = allItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [
    "All",
    ...new Set(DETAILED_MENU.map((c) => c.name)),
  ];

  const columns: Column<MenuItem>[] = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 rounded object-cover"
          />
          <span>{value}</span>
        </div>
      ),
    },
    { key: "price", label: "Price" },
    {
      key: "category",
      label: "Category",
      render: (value) => (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    { key: "type", label: "Item Type" },
    {
      key: "id",
      label: "Actions",
      render: () => (
        <button className="text-gray-500 hover:text-black ml-auto">•••</button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search for an item"
          className="border px-3 py-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {uniqueCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <button className="bg-teal-500 text-white px-4 py-2 rounded">
          + Add Item
        </button>
      </div>

      <DynamicTable
        data={filtered}
        columns={columns}
        rowKey="id"
        tableClassName="w-full text-sm"
        rowClassName="hover:bg-slate-50 dark:hover:bg-slate-900"
      />
    </div>
  );
};

export default ItemList;
