import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 🔥 HIDE LOADER AFTER LOAD
window.addEventListener("load", () => {
	const loader = document.getElementById("global-loader");
	if (loader) loader.style.opacity = "0";
	loader.style.transition = "opacity 0.3s ease";

	setTimeout(() => {
		loader.style.display = "none";
	}, 300);
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
