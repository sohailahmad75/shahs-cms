export const InvoiceTotal = ({ total }) => (
  <div className="border-t pt-4 mt-6 text-right text-lg font-bold">
    Total: £{total.toFixed(2)}
  </div>
);
