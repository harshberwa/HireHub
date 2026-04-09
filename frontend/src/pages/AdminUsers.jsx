import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [actionId, setActionId] = useState(null);

	// ✅ FETCH USERS
	const fetchUsers = async () => {
		try {
			const res = await API.get("/admin/users");
			setUsers(res.data.users || []);
		} catch (err) {
			console.log(err);
			toast.error("Failed to load users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// ❌ DELETE USER
	const deleteUser = async (id) => {
		if (!confirm("Are you sure you want to delete this user?")) return;

		try {
			setActionId(id);

			await API.delete(`/admin/users/${id}`);

			toast.success("User deleted");

			// UI update
			setUsers((prev) => prev.filter((u) => u._id !== id));
		} catch (err) {
			toast.error("Delete failed");
		} finally {
			setActionId(null);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
				Loading users...
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			<h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				All Users
			</h1>

			<div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full text-left">
						<thead className="bg-white/30 dark:bg-white/10 text-gray-800 dark:text-gray-200 uppercase text-sm">
							<tr>
								<th className="p-4">Name</th>
								<th className="p-4">Email</th>
								<th className="p-4">Role</th>
								<th className="p-4 text-center">Actions</th>
							</tr>
						</thead>

						<tbody>
							{users.map((user) => (
								<tr
									key={user._id}
									className="border-t border-white/10 hover:bg-white/20 dark:hover:bg-white/5 transition"
								>
									<td className="p-4 font-semibold text-gray-900 dark:text-white">
										{user.name}
									</td>

									<td className="p-4 text-gray-700 dark:text-gray-300">
										{user.email}
									</td>

									<td className="p-4">
										<span
											className={`px-3 py-1 text-xs font-semibold rounded-full ${
												user.role === "admin"
													? "bg-purple-200 text-purple-800"
													: user.role === "hr"
														? "bg-blue-200 text-blue-800"
														: "bg-green-200 text-green-800"
											}`}
										>
											{user.role}
										</span>
									</td>

									<td className="p-4 text-center">
										<button
											onClick={() => deleteUser(user._id)}
											disabled={actionId === user._id}
											className="px-4 py-1 text-sm rounded-lg text-white bg-red-500 hover:bg-red-600 disabled:opacity-40"
										>
											{actionId === user._id
												? "Deleting..."
												: "Delete"}
										</button>
									</td>
								</tr>
							))}

							{users.length === 0 && (
								<tr>
									<td
										colSpan="4"
										className="text-center p-8 text-gray-500 dark:text-gray-400"
									>
										No Users Found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default AdminUsers;
