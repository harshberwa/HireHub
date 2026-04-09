import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const checkSession = () => {
			const loginTime = localStorage.getItem("loginTime");

			if (!loginTime) return;

			const now = Date.now();
			const diff = now - loginTime;

			const ONE_DAY = 24 * 60 * 60 * 1000;

			// ✅ Logout after 24h
			if (diff > ONE_DAY) {
				localStorage.clear();
				alert("Session expired, please login again");
				navigate("/login");
			}
		};

		// run once
		checkSession();

		// run every 1 min
		const interval = setInterval(checkSession, 60000);

		return () => clearInterval(interval);
	}, [navigate]);
};

export default useAutoLogout;
