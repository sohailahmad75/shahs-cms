import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import {
  useResendVerificationMutation,
  useVerifyEmailQuery,
} from "../../../services/authApi";
import { getErrorMessage } from "../../../helper";
import Button from "../../../components/Button";
import { useEffect } from "react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")!;
  const navigate = useNavigate();
  const { data, error, isLoading, isSuccess, isError } = useVerifyEmailQuery(
    token,
    {
      skip: !token,
    },
  );

  const [resendVerification, { isLoading: isResendVerification }] =
    useResendVerificationMutation();

  // ✅ Only show toast once when success or error happens
  useEffect(() => {
    if (isSuccess)
      toast.success(data?.message || "Email verified successfully");
    navigate("/login");
    if (isError) toast.error(getErrorMessage(error));
  }, [isSuccess, isError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center justify-center flex flex-col">
        {isLoading && (
          <>
            <Loader className="animate-spin mx-auto text-orange-500" />
            <p className="mt-4 text-sm text-gray-600">
              Verifying your email...
            </p>
          </>
        )}

        {isSuccess && (
          <>
            <h2 className="text-green-600 font-semibold text-xl mb-2">
              Email Verified!
            </h2>
            <p className="text-sm text-gray-600">
              You can now log in to your account.
            </p>
          </>
        )}

        {isError && (
          <>
            <h2 className="text-red-600 font-semibold text-xl mb-2">
              Verification Failed
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              The token may be invalid or expired.
            </p>
            <Button
              onClick={async () => {
                try {
                  const res = await resendVerification({ token }).unwrap();
                  toast.success(res.message || "Verification email resent");
                  navigate("/login");
                } catch (error) {
                  toast.error(getErrorMessage(error));
                }
              }}
              disabled={isResendVerification}
              loading={isResendVerification}
            >
              Resend Verification Email
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
