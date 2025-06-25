import { Link, useNavigate } from "react-router-dom";
import { Form, Formik, type FormikProps } from "formik";
import * as Yup from "yup";
import InputField from "../../components/InputField";
import authImage from "../../assets/images/login.png";
import shahIcon from "../../assets/images/shahs-logo-icon.png";
import EmailIcons from "../../assets/styledIcons/EmailIcons";
import EyeOpen from "../../assets/styledIcons/EyeOpen";
import EyeCloseIcon from "../../assets/styledIcons/EyeCloseIcon";
import { useState } from "react";

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (values: SignupFormValues) => {
    console.log(values);
    localStorage.setItem("token", "demo-token");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-4 mx-auto">
            <img src={shahIcon} alt="logo" className="h-12" />
          </div>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Create your account
            </h3>
            <p className="text-gray-600 mt-2">
              Sign up to get started with Shah's
            </p>
          </div>

          <Formik<SignupFormValues>
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({
              values,
              handleChange,
              errors,
              touched,
            }: FormikProps<SignupFormValues>) => (
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

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Password
                  </label>
                  <InputField
                    name="password"
                    type={!showPassword ? "password" : "text"}
                    placeholder="Create a password"
                    value={values.password}
                    onChange={handleChange}
                    icon={
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer p-1"
                      >
                        {showPassword ? (
                          <EyeCloseIcon size={20} />
                        ) : (
                          <EyeOpen size={20} />
                        )}
                      </span>
                    }
                    error={
                      touched.password && errors.password ? errors.password : ""
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <InputField
                    name="confirmPassword"
                    type={!showConfirmPassword ? "password" : "text"}
                    placeholder="Confirm your password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    icon={
                      <span
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="cursor-pointer p-1"
                      >
                        {showConfirmPassword ? (
                          <EyeCloseIcon size={20} />
                        ) : (
                          <EyeOpen size={20} />
                        )}
                      </span>
                    }
                    error={
                      touched.confirmPassword && errors.confirmPassword
                        ? errors.confirmPassword
                        : ""
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-500">
                      Sign In
                    </Link>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition cursor-pointer"
                >
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="hidden md:block md:w-1/2">
          <img
            src={authImage}
            alt="signup"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
