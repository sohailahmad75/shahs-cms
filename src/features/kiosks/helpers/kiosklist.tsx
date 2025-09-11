

export const kioskFiltersConfig = [
    {
        key: 'createdAt',
        label: 'Created At',
        type: 'date',
    },
    {
        key: 'deviceType',
        label: 'Device Type',
        type: 'select',
        options: [
            { label: 'Self-Service', value: '1' },
            { label: 'Till', value: '2' },
        ],
    },
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Maintenance', value: 'maintenance' },
        ],
    },
    {
        key: 'storeId',
        label: 'Store',
        type: 'select',
        options: [
            { label: 'Store 1', value: '1' },
            { label: 'Store 2', value: '2' },
        ],
    },
];