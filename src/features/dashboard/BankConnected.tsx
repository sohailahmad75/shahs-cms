import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useFinalizeBankMutation } from "./dashboardApi";

const BankConnected = () => {
  const [searchParams] = useSearchParams();
  const hasFinalized = useRef(false); // 👈 add this

  const [finalizeBank] = useFinalizeBankMutation();

  useEffect(() => {
    const userId = searchParams.get("ref");

    if (userId && !hasFinalized.current) {
      hasFinalized.current = true; // ✅ lock
      finalizeBank({ userId })
        .unwrap()
        .then((res) => {
          console.log("Bank linked successfully:", res);
        })
        .catch((err) => {
          console.error("Failed to finalize bank connection", err);
        });
    }
  }, [searchParams, finalizeBank]);

  return <p>Finalizing your bank connection...</p>;
};

export default BankConnected;
