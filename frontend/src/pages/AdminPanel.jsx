import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AdminPanel() {
	const [users, setUsers] = useState([]);
	const [jobs, setJobs] = useState([]);
	const [stats, setStats] = useState({});
	const [pendingHR, setPendingHR] = useState([]);

	// FETCH
	const fetchUsers = async () => {
		try {
			const res = await API.get("/admin/users");
			setUsers(res.data.users);
		} catch {
			toast.error("Failed to load users");
		}
	};

	const fetchJobs = async () => {
		try {
			const res = await API.get("/admin/jobs");
			setJobs(res.data.jobs);
		} catch {
			toast.error("Failed to load jobs");
		}
	};

	const fetchStats = async () => {
		try {
			const res = await API.get("/admin/stats");
			setStats(res.data);
		} catch {
			toast.error("Stats load failed");
		}
	};

	const fetchPendingHR = async () => {
		try {
			const res = await API.get("/admin/pending-hr");
			setPendingHR(res.data.hrUsers);
		} catch {
			toast.error("Failed to load HR requests");
		}
	};

	useEffect(() => {
		fetchUsers();
		fetchJobs();
		fetchStats();
		fetchPendingHR();
	}, []);

	// ACTIONS
	const handleDeleteUser = async (id) => {
		if (!window.confirm("Delete this user?")) return;
		await API.delete(`/admin/users/${id}`);
		setUsers(users.filter((u) => u._id !== id));
		toast.success("User deleted");
	};

	const handleDeleteJob = async (id) => {
		if (!window.confirm("Delete this job?")) return;
		await API.delete(`/admin/jobs/${id}`);
		setJobs(jobs.filter((j) => j._id !== id));
		toast.success("Job deleted");
	};

	const handleApprove = async (id) => {
		await API.put(`/admin/approve-hr/${id}`);
		setPendingHR((prev) => prev.filter((u) => u._id !== id));
		toast.success("HR Approved");
	};

	const handleReject = async (id) => {
		await API.delete(`/admin/reject-hr/${id}`);
		setPendingHR((prev) => prev.filter((u) => u._id !== id));
		toast.success("HR Rejected");
	};

	return (
		<div className="min-h-screen px-6 md:px-10 py-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			{/* HEADER */}
			<h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				Admin Dashboard
			</h1>

			{/* 🔥 STATS */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
				{[
					{
						label: "Users",
						value: stats.totalUsers,
						color: "text-blue-600",
					},
					{
						label: "Jobs",
						value: stats.totalJobs,
						color: "text-purple-600",
					},
					{
						label: "HR",
						value: stats.totalHR,
						color: "text-green-600",
					},
					{
						label: "Students",
						value: stats.totalStudents,
						color: "text-pink-600",
					},
				].map((item, i) => (
					<div
						key={i}
						className="group backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/30 p-6 rounded-2xl shadow-lg text-center transition duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1"
					>
						<h3 className="text-gray-700 dark:text-gray-200 font-medium mb-1">
							{item.label}
						</h3>

						<p
							className={`text-3xl font-bold ${item.color} transition group-hover:scale-110`}
						>
							{item.value || 0}
						</p>
					</div>
				))}
			</div>

			{/* 🔥 PENDING HR */}
			<div className="mb-12 backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/30 p-6 rounded-2xl shadow-xl">
				<h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
					Pending HR Approval 🚀
				</h2>

				{pendingHR.length === 0 ? (
					<p className="text-gray-500 dark:text-gray-400">
						No pending HR
					</p>
				) : (
					pendingHR.map((hr) => (
						<div
							key={hr._id}
							className="flex justify-between items-center mb-3 p-4 rounded-xl bg-white/40 dark:bg-white/5 transition hover:bg-white/60 dark:hover:bg-white/10"
						>
							<div>
								<p className="font-semibold text-gray-800 dark:text-white">
									{hr.name}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{hr.email}
								</p>
							</div>

							<div className="flex gap-3">
								<button
									onClick={() => handleApprove(hr._id)}
									className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
								>
									Approve
								</button>

								<button
									onClick={() => handleReject(hr._id)}
									className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
								>
									Reject
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* USERS */}
			<div className="mb-16 backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
				<h2 className="text-2xl font-semibold p-6 text-gray-800 dark:text-white">
					All Users
				</h2>

				<table className="min-w-full text-gray-800 dark:text-gray-200">
					<tbody>
						{users.map((u) => (
							<tr
								key={u._id}
								className="border-t hover:bg-white/40 dark:hover:bg-white/5 transition"
							>
								<td className="p-4">{u.name}</td>
								<td className="p-4">{u.email}</td>
								<td className="p-4 capitalize">{u.role}</td>
								<td className="p-4">
									<button
										onClick={() => handleDeleteUser(u._id)}
										className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* JOBS */}
			<div className="backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
				<h2 className="text-2xl font-semibold p-6 text-gray-800 dark:text-white">
					All Jobs
				</h2>

				<table className="min-w-full text-gray-800 dark:text-gray-200">
					<tbody>
						{jobs.map((j) => (
							<tr
								key={j._id}
								className="border-t hover:bg-white/40 dark:hover:bg-white/5 transition"
							>
								<td className="p-4">{j.title}</td>
								<td className="p-4">{j.company}</td>
								<td className="p-4">{j.postedBy?.name}</td>
								<td className="p-4">
									<button
										onClick={() => handleDeleteJob(j._id)}
										className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default AdminPanel;
