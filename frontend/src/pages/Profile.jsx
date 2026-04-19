import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Profile() {
	const [user, setUser] = useState({
		name: "",
		email: "",
		role: "",
		resume: "",
		bio: "",
		skills: [],
	});

	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);

	// ✅ DEPLOY FIX
	const backendBaseUrl = (
		import.meta.env.VITE_API_URL || "http://localhost:5000/api"
	).replace("/api", "");

	// ✅ LOAD PROFILE
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await API.get("/users/me");
				setUser(res.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchProfile();
	}, []);

	// ✅ HANDLE INPUT
	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	// ✅ UPDATE PROFILE
	const handleUpdate = async (e) => {
		e.preventDefault();

		try {
			const res = await API.put("/users/update-profile", {
				...user,
				skills: Array.isArray(user.skills)
					? user.skills.join(", ")
					: user.skills,
			});

			toast.success(res.data.message);
		} catch (error) {
			toast.error("Update failed");
		}
	};

	// ✅ FILE SELECT
	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	// ✅ UPLOAD RESUME
	const handleUpload = async (e) => {
		e.preventDefault();

		if (!file) {
			return toast.error("Select a PDF file");
		}

		try {
			setLoading(true);

			const formData = new FormData();
			formData.append("resume", file);

			const res = await API.post("/auth/upload-resume", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			toast.success("Resume uploaded ✅");

			setUser((prev) => ({
				...prev,
				resume: res.data.resume,
			}));
		} catch (error) {
			toast.error(error.response?.data?.message || "Upload failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center py-16 px-4">
			<div className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-2xl shadow-xl transition">
				<h2 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-purple-400">
					My Profile
				</h2>

				<form onSubmit={handleUpdate} className="space-y-4">
					{/* NAME */}
					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-1">
							Name
						</label>
						<input
							type="text"
							name="name"
							value={user.name}
							onChange={handleChange}
							className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
					</div>

					{/* EMAIL */}
					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-1">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={user.email}
							onChange={handleChange}
							className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
					</div>

					{/* ROLE */}
					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-1">
							Role
						</label>
						<input
							type="text"
							value={user.role}
							disabled
							className="w-full border px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-white"
						/>
					</div>

					{/* BIO */}
					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-1">
							Bio
						</label>
						<textarea
							name="bio"
							value={user.bio}
							onChange={handleChange}
							className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
					</div>

					{/* SKILLS INPUT */}
					<div>
						<label className="block text-gray-700 dark:text-gray-300 mb-1">
							Skills (comma separated)
						</label>
						<input
							type="text"
							name="skills"
							value={
								Array.isArray(user.skills)
									? user.skills.join(", ")
									: user.skills
							}
							onChange={handleChange}
							className="w-full border px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-white"
						/>
					</div>

					{/* SKILLS DISPLAY */}
					<div className="flex flex-wrap gap-2">
						{Array.isArray(user.skills) &&
							user.skills.map((skill, i) => (
								<span
									key={i}
									className="px-3 py-1 text-xs rounded-full bg-blue-200 text-blue-800 dark:bg-purple-600 dark:text-white"
								>
									{skill}
								</span>
							))}
					</div>

					{/* RESUME SECTION */}
					<h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
						Resume
					</h3>

					<div className="mt-2 p-5 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 shadow-md">
						{user.resume && (
							<div className="mb-3 text-center">
								<span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">
									Resume Uploaded ✅
								</span>
							</div>
						)}

						<input
							type="file"
							accept="application/pdf"
							onChange={handleFileChange}
							className="mb-3 w-full"
						/>

						<button
							onClick={handleUpload}
							disabled={loading}
							className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600"
						>
							{loading
								? "Uploading..."
								: "Upload / Replace Resume"}
						</button>

						{user.resume && (
							<div className="flex justify-center gap-4 mt-4">
								<a
									href={`${backendBaseUrl}${user.resume}`}
									target="_blank"
									rel="noreferrer"
									className="px-4 py-1 text-sm rounded-lg bg-blue-500 text-white"
								>
									View 📄
								</a>

								<a
									href={`${backendBaseUrl}${user.resume}`}
									download
									className="px-4 py-1 text-sm rounded-lg bg-green-500 text-white"
								>
									Download ⬇️
								</a>
							</div>
						)}
					</div>

					<button className="w-full bg-blue-600 dark:bg-purple-600 text-white py-2 rounded-lg">
						Update Profile
					</button>
				</form>
			</div>
		</div>
	);
}

export default Profile;
