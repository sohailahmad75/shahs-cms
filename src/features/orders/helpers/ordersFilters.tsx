export const orderFiltersConfig = [
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
    isRange: true,
  },
  {
    key: "placedAt",
    label: "Placed At",
    type: "date",
    isRange: true,
  },
  {
    key: "provider",
    label: "Provider",
    type: "select",
    options: [
      { label: "Kiosk", value: "kiosk" },
      { label: "Uber", value: "uber" },
      { label: "Deliveroo", value: "deliveroo" },
    ],
  },
  {
    key: "type",
    label: "Order Type",
    type: "select",
    options: [
      { label: "Dine-in", value: "dine-in" },
      { label: "Takeaway", value: "takeaway" },
      { label: "Delivery", value: "delivery" },
    ],
  },
  {
    key: "state",
    label: "Status",
    type: "select",
    options: [
      { label: "Created", value: "created" },
      { label: "Preparing", value: "preparing" },
      { label: "Ready", value: "ready" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
  {
    key: "totalAmount",
    label: "Total Amount",
    type: "number",
    isRange: true,
  },
];
