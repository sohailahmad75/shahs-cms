import { useState } from "react";
import Button from "../../components/Button";
import ConnectBankModal from "./components/ConnectBankModal";

const BankTransactions = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid md:grid-cols-2 gap-6 relative">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          Automate income and expense tracking
        </h2>
        <p className="text-gray-600 mb-4">
          Save hours of work by tracking finances automatically
        </p>

        <ol className="list-decimal list-inside space-y-2 text-green-700 font-medium mb-6">
          <li>Connect a bank or credit card to get started</li>
          <li>Review and add your transactions</li>
          <li>See how your business is doing</li>
        </ol>

        <div className="flex w-full">
          <Button onClick={() => setOpen(true)} className="w-fit">
            Connect account
          </Button>
        </div>
      </div>

      {/* Right */}
      <div className="border rounded p-4 bg-gray-50">
        <p className="text-xs text-gray-500 font-semibold mb-1">EXAMPLE</p>
        <h3 className="text-lg font-semibold">PROFIT & LOSS</h3>
        <p className="text-2xl font-bold text-gray-700 mt-2 mb-1">£7,876</p>
        <p className="text-sm text-gray-600 mb-4">Net profit for last month</p>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Income</span>
              <span>£12,344</span>
            </div>
            <div className="h-3 bg-green-500 rounded w-full"></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Expenses</span>
              <span>£4,468</span>
            </div>
            <div className="h-3 bg-teal-500 rounded w-[40%]"></div>
          </div>
        </div>
      </div>

      {/* Bank Connect Modal */}
      <ConnectBankModal
        isOpen={open}
        onClose={() => setOpen(false)}
        userId={31}
      />
    </div>
  );
};

export default BankTransactions;
