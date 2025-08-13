import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetMenuItemsQuery } from "../../services/menuApi";
import AddItemModal from "./AddItemModal";
import Button from "../../components/Button";
import { DynamicTable } from "../../components/DynamicTable";
import Loader from "../../components/Loader";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import AddIcon from "../../assets/styledIcons/AddIcon";

type Item = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  signedUrl?: string;
  tags?: string | null;
  categoryName?: string;
  category?: { id: string; name: string };
};

const ItemList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const { data: items = [], isLoading } = useGetMenuItemsQuery(menuId);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddItem, setShowAddItem] = useState(false);

  // Build category list from API data
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i: Item) =>
      set.add(i.category?.name || i.categoryName || "Uncategorized"),
    );
    return ["All", ...Array.from(set)];
  }, [items]);

  // Shape data for table (flatten category + image)
  const tableData = useMemo(() => {
    return (items as Item[]).map((i) => ({
      ...i,
      image: i.signedUrl || "",
      categoryLabel: i.category?.name || i.categoryName || "Uncategorized",
    }));
  }, [items]);

  // Search + Filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tableData.filter((row) => {
      const matchesSearch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        (row.description || "").toLowerCase().includes(q) ||
        (row.tags || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "All" || row.categoryLabel === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [tableData, search, categoryFilter]);

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
      key: "categoryLabel",
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
            options={categories.map((cat) => ({
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

      <DynamicTable
        data={filtered}
        columns={columns}
        rowKey="id"
        tableClassName="w-full text-sm"
        // rowClassName="hover:bg-slate-50 dark:hover:bg-slate-900"
      />

      <AddItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        categories={
          // pass minimal category list for the modal
          Array.from(
            new Map(
              (items as Item[]).map((i) => [
                i.category?.id || i.categoryName || "uncat",
                {
                  id: i.category?.id || "",
                  name: i.category?.name || i.categoryName || "Uncategorized",
                },
              ]),
            ).values(),
          )
        }
        selectedCategory={{ id: "", name: "" }}
      />
    </div>
  );
};

export default ItemList;
