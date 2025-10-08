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
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../services/authApi";
import { setAdmin } from "./authSlice";
import Button from "../../components/Button";
import { useTheme } from "../../context/themeContext";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const res = await login(values).unwrap();

      dispatch(
        setAdmin({
          admin: {
            ...res.admin,
            imageUrl:
              "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250",
          },
          token: res.token,
          isAuthenticated: true,
        }),
      );

      navigate("/dashboard");
    } catch (error) {
      console.log("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? "bg-slate-900" : "bg-gray-100"
      }`}>
      <div className={`rounded-lg shadow-lg w-full max-w-6xl flex flex-col md:flex-row overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-white"
        }`}>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-4 mx-auto">
            <img src={shahIcon} alt="logo" className="h-12" />
          </div>
          <div className="text-center mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-slate-100" : "text-gray-800"
              }`}>
             hello Log in to your account
            </h3>
            <p className={`mt-2 ${isDarkMode ? "text-slate-400" : "text-gray-600"
              }`}>
              Welcome back! Please enter your details.
            </p>
          </div>

          <Formik<LoginFormValues>
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({
              values,
              handleChange,
              errors,
              touched,
            }: FormikProps<LoginFormValues>) => (
              <Form className="space-y-5" noValidate>
                <div>
                  <label className={`block mb-1 font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}>
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
                  <label className={`block mb-1 font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"
                    }`}>
                    Password
                  </label>
                  <InputField
                    name="password"
                    type={!showPassword ? "password" : "text"}
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    icon={
                      showPassword ? (
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer flex"
                        >
                          <EyeCloseIcon size={20} />
                        </span>
                      ) : (
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer flex"
                        >
                          <EyeOpen size={20} />
                        </span>
                      )
                    }
                    error={
                      touched.password && errors.password ? errors.password : ""
                    }

                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"
                    }`}>
                    Don't have an account?{" "}
                    <Link to="/signup" className={`${isDarkMode ? "text-slate-400" : "text-orange-500"
                      } text-orange-500 ${isDarkMode ? "hover:text-slate-100" : "hover:text-orange-600"
                      } hover:text-orange-600`}>
                      Sign Up
                    </Link>
                  </p>
                  <Link
                    to="/forgot-password"
                    className={`${isDarkMode ? "text-slate-400" : "text-orange-500"
                      } text-orange-500 ${isDarkMode ? "hover:text-slate-100" : "hover:text-orange-600"
                      }text-sm `}
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  loading={isLoading}
                  type="submit"
                  className={`w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition cursor-pointer`}
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="hidden md:block md:w-1/2">
          <img
            src={authImage}
            alt="login"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;