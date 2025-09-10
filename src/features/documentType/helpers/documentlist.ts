export const documentTypeFiltersConfig = [
    {
        key: 'createdAt',
        label: 'Created At',
        type: 'date',
    },
    {
        key: 'role',
        label: 'All Roles',
        type: 'select',
        options: [
            { label: "Shop", value: "shop" },
            { label: "Owner", value: "owner" },
            { label: "Staff", value: "staff" },
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
