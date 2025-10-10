export const InvoiceTotal = ({ total ,isDarkMode }) => (
  <div className={`border-t pt-4 mt-6 text-right text-lg font-bold  ${isDarkMode ? "text-slate-300" : "text-gray-700"
            }`}>
    Total: £{total.toFixed(2)}
  </div>
);
