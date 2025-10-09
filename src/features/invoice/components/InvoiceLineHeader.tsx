export const InvoiceLineHeader = ({ isDarkMode }) => (
    <div
        className={`text-sm font-semibold grid grid-cols-8 gap-2 border-b pb-1 mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"
            }`}
    >
        <span>#</span>
        <span>Service Date</span>
        <span>Product</span>
        <span>Description</span>
        <span>Qty</span>
        <span>Rate</span>
        <span>Amount</span>
        <span></span>
    </div>
);
