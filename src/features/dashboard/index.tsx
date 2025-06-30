import { useConnectBankMutation, useGetBanksQuery } from "./dashboardApi";
import { useState } from "react";
import SelectField from "../../components/SelectField";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { data: banks = [], isLoading } = useGetBanksQuery(undefined);
  const [connectBank, { isLoading: isConnecting }] = useConnectBankMutation();

  const [selectedBankId, setSelectedBankId] = useState("");

  const handleBankChange = (e: React.ChangeEvent<any>) => {
    setSelectedBankId(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedBankId) return toast.error("Please select a bank");

    try {
      const res = await connectBank({
        userId: 23,
        institutionId: selectedBankId,
      }).unwrap();

      toast.success("Bank connection link generated");
      window.open(res.link, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      const fallbackMessage = "Failed to connect to bank";

      const apiMessage = err?.data?.message;
      const referenceSummary = err?.data?.details?.reference?.summary;
      const otherDetail = err?.data?.details?.detail;

      toast.error(
        referenceSummary || otherDetail || apiMessage || fallbackMessage,
      );
    }
  };

  const bankOptions =
    banks?.map((bank: any) => ({
      label: bank.name,
      value: bank.id,
    })) || [];

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-semibold">Connect Your Bank</h2>

      {isLoading ? (
        <p>Loading banks...</p>
      ) : (
        <>
          <SelectField
            name="bank"
            value={selectedBankId}
            onChange={handleBankChange}
            options={bankOptions}
            placeholder="Select a bank"
          />

          <button
            onClick={handleSubmit}
            disabled={!selectedBankId || isConnecting}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            {isConnecting ? "Connecting..." : "Connect Bank"}
          </button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
