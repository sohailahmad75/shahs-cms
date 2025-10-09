

export const invoiceFiltersConfig = [
    {
        key: 'createdDate',
        label: 'Created',
        type: 'date' as const,
        isRange: true,
    },
    {
        key: 'paymentDate',
        label: 'Payment',
        type: 'date' as const,
        isRange: true,
    },
    {
        key: 'store',
        label: 'Store',
        type: 'select' as const,
        options: [
            { label: 'Main Branch', value: 'main' },
            { label: 'Downtown Store', value: 'downtown' },
            { label: 'Online', value: 'online' },
        ],
    },
    {
        key: 'customerName',
        label: 'Customer Name',
        type: 'input' as const,
        placeholder: 'Enter customer name',
    },
    {
        key: 'invoiceId',
        label: 'Invoice ID',
        type: 'input' as const,
        placeholder: 'Enter invoice ID',
    },
    {
        key: 'invoiceStatus',
        label: 'Invoice Status',
        type: 'select' as const,
        options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Pending', value: 'pending' },
            { label: 'Paid', value: 'paid' },
            { label: 'Overdue', value: 'overdue' },
            { label: 'Cancelled', value: 'cancelled' },
        ],
    },
];
