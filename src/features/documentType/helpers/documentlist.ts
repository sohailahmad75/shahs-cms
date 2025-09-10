export const documentTypeFiltersConfig = [
    {
        key: 'createdAt',
        label: 'Created At',
        type: 'date',
        isRange: true,
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
        key: 'staffKind',
        label: 'Staff Kind',
        type: 'select',
        options: [
            { label: "Full-time", value: "full_time" },
            { label: "Student", value: "student" },
            { label: "Sponsored", value: "sponsored" },
            { label: "PSW", value: "psw" },
            { label: "Asylum", value: "asylum" },
            { label: "Other", value: "other" },
        ],
    },
    {
        key: 'isMandatory',
        label: 'Mandatory',
        type: 'select',
        options: [
            { label: "Required", value: "true" },
            { label: "Not Required", value: "false" },
        ],
    },
];
