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
import EmailVerifiedSuccess from "./EmailVerifiedSuccess";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")!;

  const { data, error, isLoading, isSuccess, isError } = useVerifyEmailQuery(
    token,
    {
      skip: !token,
    },
  );

  const [resendVerification, { isLoading: isResendVerification }] =
    useResendVerificationMutation();

  useEffect(() => {
    if (isSuccess)
      toast.success(data?.message || "Email verified successfully");
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
            <EmailVerifiedSuccess />
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
