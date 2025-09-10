  export const storeFiltersConfig = [
    {
      key: 'createdAt',
      label: 'Created At',
      type: 'input',
    },
    {
      key: 'createdBy',
      label: 'Created By',
      options: ['John Doe', 'Jane Smith', 'Admin User'],
      type: 'select',
    },
    {
      key: 'storeType',
      label: 'Store Type',
      options: ['Retail', 'Wholesale', 'Online', 'Franchise'],
      type: 'select',
    },
    {
      key: 'storeOwner',
      label: 'Store Owner',
      options: ['Alice Johnson', 'Bob Wilson', 'Carol Taylor'],
      type: 'select',
    },
    {
      key: 'status',
      label: 'Status',
      options: ['Active', 'Inactive', 'Pending', 'Suspended'],
      type: 'select',
    },
  ];
