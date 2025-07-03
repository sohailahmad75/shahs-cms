import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetMenuCategoriesQuery } from "../../services/menuApi";
import AddItemModal from "../categories/AddItemModal";
import Button from "../../components/Button";
import { DynamicTable } from "../../components/DynamicTable";
import Loader from "../../components/Loader";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";

const ItemList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const { data: categories = [], isLoading } =
    useGetMenuCategoriesQuery(menuId);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddItem, setShowAddItem] = useState(false);

  const allItems: any[] = categories.flatMap((category) =>
    category?.items?.map((item: any) => ({
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

  const uniqueCategories = ["All", ...new Set(categories.map((c) => c.name))];

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value: string, row: any) => (
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
      render: (value: string) => (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: () => (
        <button className="text-gray-500 hover:text-black ml-auto">•••</button>
      ),
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-3 items-center ">
          <InputField
            name="search"
            placeholder="Search for an item"
            value={search}
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
        <Button onClick={() => setShowAddItem(true)}>+ Add Item</Button>
      </div>

      <DynamicTable
        data={filtered}
        columns={columns}
        rowKey="id"
        tableClassName="w-full text-sm"
        rowClassName="hover:bg-slate-50 dark:hover:bg-slate-900"
      />

      <AddItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        categories={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
        selectedCategory={categories[0] || { id: "", name: "" }}
      />
    </div>
  );
};

export default ItemList;
