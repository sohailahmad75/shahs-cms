// // import ReactDOM from "react-dom/client";
// // import App from "./App";
// // import "./index.css";
// // import "./assets/styles/theme.css";

// // ReactDOM.createRoot(document.getElementById("root")!).render(
// //   // <React.StrictMode>
// //   <App />,
// //   // </React.StrictMode>
// // );


// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import "./assets/styles/theme.css";

// const savedTheme = localStorage.getItem("theme") || 
//   (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
// document.documentElement.classList.toggle("dark", savedTheme === "dark");


// ReactDOM.createRoot(document.getElementById("root")!).render(
//   // <React.StrictMode>
//   <App />
//   // </React.StrictMode>
// );


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./assets/styles/theme.css";

// ✅ Set dark mode BEFORE rendering
const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

document.documentElement.classList.toggle("dark", savedTheme === "dark");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
