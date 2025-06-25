import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import router from "./routes";
import { store } from "./store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={100000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        progressClassName="hidden"
        draggable
        icon={false}
        toastClassName={(context) => {
          const base =
            "rounded-lg shadow-xl p-4 text-sm font-medium flex gap-3 relative my-1 items-center ";
          const type = context?.type || "default";

          const styles = {
            success: "bg-green-600 text-white",
            error: "bg-red-600 text-white",
            warning: "bg-yellow-400 text-black",
            info: "bg-blue-500 text-white",
            default: "bg-gray-800 text-white",
          };

          return `${base} ${styles[type]}`;
        }}
        closeButton={
          <span className="text-white hover:text-gray-200 text-lg px-2 cursor-pointer">
            ×
          </span>
        }
      />
    </Provider>
  );
}

export default App;
