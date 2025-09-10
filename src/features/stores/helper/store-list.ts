export const storeFiltersConfig = [
  {
    key: 'createdAt',
    label: 'Created At',
    type: 'date',
  },
  {
    key: 'storeType',
    label: 'Store Type',
    type: 'select',
    options: [
      { label: 'Shop', value: '1' },
      { label: 'Food Truck', value: '2' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: '1' },
      { label: 'Inactive', value: '2' },
    ],
  },
];
