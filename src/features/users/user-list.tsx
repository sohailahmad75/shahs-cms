// src/pages/users/helper/user-list.ts
export const userFiltersConfig = [
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "", label: "All Roles" },
      { value: "owner", label: "Owner" },
      { value: "staff", label: "Staff" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "All Statuses" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  {
    key: "city",
    label: "City",
    type: "text",
    placeholder: "Filter by city",
  },
];