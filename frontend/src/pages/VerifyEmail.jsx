import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function VerifyEmail() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [message, setMessage] = useState("Verifying your email...");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const verifyUserEmail = async () => {
			const token = searchParams.get("token");

			if (!token) {
				const errorMessage = "Verification token is missing.";
				setMessage(errorMessage);
				toast.error(errorMessage);
				setLoading(false);
				return;
			}

			try {
				const res = await API.get(`/auth/verify-email?token=${token}`);

				setMessage(
					res.data.message || "Email verified successfully 🎉",
				);

				toast.success(
					res.data.message || "Email verified successfully 🎉",
				);

				// AUTO LOGIN
				localStorage.setItem("token", res.data.token);
				localStorage.setItem("user", JSON.stringify(res.data.user));
				localStorage.setItem("loginTime", Date.now());

				setTimeout(() => {
					navigate("/");
					window.location.reload();
				}, 1500);
			} catch (error) {
				const errorMessage =
					error.response?.data?.message ||
					"Verification failed. Invalid or expired link.";

				setMessage(errorMessage);
				toast.error(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		verifyUserEmail();
	}, [searchParams, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			<div className="w-full max-w-md backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 rounded-2xl shadow-lg p-8 text-center">
				<h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-purple-400">
					Email Verification
				</h2>

				<p className="text-gray-700 dark:text-gray-300 mb-6">
					{loading ? "Please wait..." : message}
				</p>

				{loading && (
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Signing you in automatically...
					</p>
				)}
			</div>
		</div>
	);
}

export default VerifyEmail;
