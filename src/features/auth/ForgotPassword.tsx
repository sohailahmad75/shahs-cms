import { Link } from "react-router-dom";
import { Form, Formik, type FormikProps } from "formik";
import * as Yup from "yup";
import InputField from "../../components/InputField";
import authImage from "../../assets/images/login.png";
import shahIcon from "../../assets/images/shahs-logo-icon.png";
import EmailIcons from "../../assets/styledIcons/EmailIcons";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const handleForgotPassword = (values: ForgotPasswordFormValues) => {
    // You can replace this with actual forgot password logic
    alert(`Reset link sent to ${values.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-4 mx-auto">
            <img src={shahIcon} alt="logo" className="h-12" />
          </div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Forgot your password?
            </h3>
            <p className="text-gray-600 mt-2">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <Formik<ForgotPasswordFormValues>
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleForgotPassword}
          >
            {({
              values,
              handleChange,
              errors,
              touched,
            }: FormikProps<ForgotPasswordFormValues>) => (
              <Form className="space-y-5" noValidate>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Email
                  </label>
                  <InputField
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    icon={<EmailIcons size={20} />}
                    error={touched.email && errors.email ? errors.email : ""}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Remembered your password?{" "}
                    <Link to="/login" className="text-orange-500 ">
                      Log In
                    </Link>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition cursor-pointer"
                >
                  Send Reset Link
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="hidden md:block md:w-1/2">
          <img
            src={authImage}
            alt="forgot password"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
