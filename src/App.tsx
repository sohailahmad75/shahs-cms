import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import router from "./routes";
import { store } from "./store";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "./assets/styledIcons/CloseIcon";
import { ThemeProvider } from "../src/context/themeContext";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <RouterProvider router={router} />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar
          closeOnClick
          pauseOnHover={false}
          draggable={false}
          icon={false}
          newestOnTop
          transition={Slide}
          toastClassName={(context) => {
            const base = "rounded-lg shadow-xl p-4 text-sm font-medium flex gap-3 relative my-1 items-center ";
            const type = context?.type || "default";

            const styles = {
              success: "bg-green-600 dark:bg-green-700 text-white",
              error: "bg-red-600 dark:bg-red-700 text-white",
              warning: "bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white",
              info: "bg-blue-500 dark:bg-blue-600 text-white",
              default: "bg-gray-800 dark:bg-gray-700 text-white",
            };

            return `${base} ${styles[type]}`;
          }}
          closeButton={
            <span className="text-white hover:text-gray-200 dark:hover:text-gray-300 text-lg px-2 cursor-pointer">
              <CloseIcon size={14} />
            </span>
          }
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;