export const userFiltersConfig = [
  {
    key: 'createdAt',
    label: 'Created At',
    type: 'date',
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "", label: "All Roles" },
      { value: "1", label: "Owner" },
      { value: "3", label: "Staff" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "All Statuses" },
      { value: "1", label: "Active" },
      { value: "2", label: "Inactive" },
    ],
  },
];