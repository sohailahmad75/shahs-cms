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
  item: InvoiceItem;
  index: number;
  handleRemove: () => void;
}