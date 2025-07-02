import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useConnectBankMutation,
  useGetBanksQuery,
} from "../../dashboard/dashboardApi";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import SearchIcon from "../../../assets/styledIcons/SearchIcon";
import Loader from "../../../components/Loader";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
};

const ConnectBankModal = ({ isOpen, onClose, userId }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  const { data: banks = [], isLoading } = useGetBanksQuery(undefined);
  const [connectBank, { isLoading: isConnecting }] = useConnectBankMutation();

  const filteredBanks = useMemo(() => {
    return banks?.filter((bank: any) =>
      bank.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [banks, search]);

  const handleSubmit = async () => {
    if (!selectedBankId) return toast.error("Please select a bank");

    try {
      const res = await connectBank({
        userId: 234,
        institutionId: selectedBankId,
      }).unwrap();

      toast.success("Bank connection link generated");
      window.open(res.link, "_blank", "noopener,noreferrer");
      onClose();
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select a Bank"
      width="max-w-3xl"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4">
          {/* Search bar */}
          <InputField
            placeholder="Search bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<SearchIcon />}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
            {filteredBanks?.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-sm mt-10">
                No banks found
              </p>
            ) : (
              filteredBanks?.map((bank: any) => (
                <div
                  key={bank.id}
                  onClick={() => setSelectedBankId(bank.id)}
                  className={`cursor-pointer border rounded p-3 flex items-center gap-3 transition hover:bg-green-50 ${
                    selectedBankId === bank.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    loading="lazy"
                    className="w-10 h-10 object-contain"
                  />
                  <span className="font-medium text-sm">{bank.name}</span>
                </div>
              ))
            )}
          </div>

          {/* Submit button */}
          <Button
            className="w-full mt-auto"
            onClick={handleSubmit}
            disabled={!selectedBankId || isConnecting}
            loading={isConnecting}
          >
            Connect Bank
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ConnectBankModal;
