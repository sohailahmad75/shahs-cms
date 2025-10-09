// types.ts
export interface InvoiceItem {
    serviceDate: string;
    product: string;
    description: string;
    qty: number;
    rate: number;
}

export interface InvoiceFormValues {
    customer: string;
    email: string;
    invoiceDate: string;
    dueDate: string;
    items: InvoiceItem[];
}

export interface DraggableRowProps {
    id: number;
    item: InvoiceItem;
    index: number;
    onRemove: () => void;
    productOptions: { label: string; value: string }[];
}

export interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: InvoiceFormValues) => void;
    editingInvoice?: InvoiceFormValues | null;
    isSubmitting: boolean;
}