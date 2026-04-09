import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await API.post("/auth/login", {
				email,
				password,
			});

			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.user));

			// ✅ important for auto logout
			localStorage.setItem("loginTime", Date.now());

			setEmail("");
			setPassword("");

			toast.success(res.data.message || "Login successful ✅");

			setTimeout(() => {
				navigate("/");
				window.location.reload();
			}, 1000);
		} catch (error) {
			toast.error(error.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="flex items-center justify-center py-16 px-4">
			<div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
				<h2 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-purple-400">
					Login to HireHub
				</h2>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-1">
							Email
						</label>

						<input
							type="email"
							placeholder="Enter your email"
							className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-white"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-1">
							Password
						</label>

						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								className="w-full appearance-none border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>

							<span
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-2.5 cursor-pointer text-gray-500 dark:text-gray-300"
							>
								{showPassword ? "🙈" : "👁"}
							</span>
						</div>
					</div>

					<button className="w-full bg-blue-600 dark:bg-purple-600 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-purple-700">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
