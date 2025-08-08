// // // import { RouterProvider } from "react-router-dom";
// // // import { Provider } from "react-redux";
// // // import router from "./routes";
// // // import { store } from "./store";
// // // import { Slide, ToastContainer } from "react-toastify";
// // // import "react-toastify/dist/ReactToastify.css";
// // // import CloseIcon from "./assets/styledIcons/CloseIcon";

// // // function App() {
// // //   return (
// // //     <Provider store={store}>
// // //       <div className="bg-gray-50">
// // //         <RouterProvider router={router} />
// // //       </div>

// // //       <ToastContainer
// // //         position="top-right"
// // //         autoClose={1500} // 1.5 seconds
// // //         hideProgressBar
// // //         closeOnClick
// // //         pauseOnHover={false}
// // //         draggable={false}
// // //         icon={false}
// // //         newestOnTop
// // //         transition={Slide}
// // //         toastClassName={(context) => {
// // //           const base =
// // //             "rounded-lg shadow-xl p-4 text-sm font-medium flex gap-3 relative my-1 items-center ";
// // //           const type = context?.type || "default";

// // //           const styles = {
// // //             success: "bg-green-600 text-white",
// // //             error: "bg-red-600 text-white",
// // //             warning: "bg-yellow-400 text-black",
// // //             info: "bg-blue-500 text-white",
// // //             default: "bg-gray-800 text-white",
// // //           };

// // //           return `${base} ${styles[type]}`;
// // //         }}
// // //         closeButton={
// // //           <span className="text-white hover:text-gray-200 text-lg px-2 cursor-pointer">
// // //             <CloseIcon size={14} />
// // //           </span>
// // //         }
// // //       />
// // //     </Provider>
// // //   );
// // // }

// // // export default App;



// // import { RouterProvider } from "react-router-dom";
// // import { Provider } from "react-redux";
// // import router from "./routes";
// // import { store } from "./store";
// // import { Slide, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import CloseIcon from "./assets/styledIcons/CloseIcon";
// // import { useEffect } from "react";

// // function App() {
// //   useEffect(() => {
// //   // Optional: add transition class to body if needed
// //   document.body.classList.add("transition-colors", "duration-300");
// // }, []);


// //   return (
// //     <Provider store={store}>
// //       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
// //         <RouterProvider router={router} />
// //       </div>

// //       <ToastContainer
// //         position="top-right"
// //         autoClose={1500}
// //         hideProgressBar
// //         closeOnClick
// //         pauseOnHover={false}
// //         draggable={false}
// //         icon={false}
// //         newestOnTop
// //         transition={Slide}
// //         toastClassName={(context) => {
// //           const base = "rounded-lg shadow-xl p-4 text-sm font-medium flex gap-3 relative my-1 items-center ";
// //           const type = context?.type || "default";

// //           const styles = {
// //             success: "bg-green-600 dark:bg-green-700 text-white",
// //             error: "bg-red-600 dark:bg-red-700 text-white",
// //             warning: "bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white",
// //             info: "bg-blue-500 dark:bg-blue-600 text-white",
// //             default: "bg-gray-800 dark:bg-gray-700 text-white",
// //           };

// //           return `${base} ${styles[type]}`;
// //         }}
// //         closeButton={
// //           <span className="text-white hover:text-gray-200 dark:hover:text-gray-300 text-lg px-2 cursor-pointer">
// //             <CloseIcon size={14} />
// //           </span>
// //         }
// //         className="dark:bg-gray-800" // Add dark mode support for toast body
// //       />
// //     </Provider>
// //   );
// // }

// // export default App;


// import { RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
// import router from "./routes";
// import { store } from "./store";
// import { Slide, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import CloseIcon from "./assets/styledIcons/CloseIcon";
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     // Initialize theme from localStorage or prefer-color-scheme
//     const savedTheme = localStorage.getItem("theme") ||
//       (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
//     document.documentElement.classList.toggle("dark", savedTheme === "dark");
//     document.body.classList.add("transition-colors", "duration-300");
//   }, []);

//   return (
//     <Provider store={store}>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//         <RouterProvider router={router} />
//       </div>

//       <ToastContainer
//         position="top-right"
//         autoClose={1500}
//         hideProgressBar
//         closeOnClick
//         pauseOnHover={false}
//         draggable={false}
//         icon={false}
//         newestOnTop
//         transition={Slide}
//         toastClassName={(context) => {
//           const base = "rounded-lg shadow-xl p-4 text-sm font-medium flex gap-3 relative my-1 items-center ";
//           const type = context?.type || "default";

//           const styles = {
//             success: "bg-green-600 dark:bg-green-700 text-white",
//             error: "bg-red-600 dark:bg-red-700 text-white",
//             warning: "bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white",
//             info: "bg-blue-500 dark:bg-blue-600 text-white",
//             default: "bg-gray-800 dark:bg-gray-700 text-white",
//           };

//           return `${base} ${styles[type]}`;
//         }}
//         closeButton={
//           <span className="text-white hover:text-gray-200 dark:hover:text-gray-300 text-lg px-2 cursor-pointer">
//             <CloseIcon size={14} />
//           </span>
//         }
//       />
//     </Provider>
//   );
// }

// export default App;



// src/App.tsx
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import router from "./routes";
import { store } from "./store";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "./assets/styledIcons/CloseIcon";
import { ThemeProvider } from "./context/ThemeContext";

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