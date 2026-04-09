import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Applicants = () => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(false);
	const [actionId, setActionId] = useState(null);

	const { jobId } = useParams();
	const token = localStorage.getItem("token");

	const fetchApplicants = async () => {
		try {
			setLoading(true);

			const res = await fetch(
				`http://localhost:5000/api/applications/${jobId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			const data = await res.json();

			setApplications(data.applications || []);
		} catch (error) {
			console.log(error);
			toast.error("Failed to load applicants");
		} finally {
			setLoading(false);
		}
	};

	const updateStatus = async (id, status) => {
		try {
			setActionId(id);

			const res = await fetch(
				`http://localhost:5000/api/applications/status/${id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ status }),
				},
			);

			if (res.ok) {
				toast.success(`Candidate ${status}`);

				setApplications((prev) =>
					prev.map((app) =>
						app._id === id ? { ...app, status } : app,
					),
				);
			} else {
				const err = await res.json();
				toast.error(err.message || "Action failed");
			}
		} catch (error) {
			console.log(error);
			toast.error("Server error");
		} finally {
			setActionId(null);
		}
	};

	useEffect(() => {
		fetchApplicants();
	}, [jobId]);

	return (
		<div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			<h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				Job Applicants
			</h1>

			<div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
				{loading ? (
					<p className="text-center p-8 text-gray-600 dark:text-gray-300">
						Loading applicants...
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full text-left">
							<thead className="bg-white/30 dark:bg-white/10 text-gray-700 dark:text-gray-200 text-sm uppercase">
								<tr>
									<th className="p-4">Applicant</th>
									<th className="p-4">Email</th>
									<th className="p-4">Job</th>

									{/* ✅ NEW COLUMN */}
									<th className="p-4 text-center">Resume</th>

									<th className="p-4">Status</th>
									<th className="p-4 text-center">Actions</th>
								</tr>
							</thead>

							<tbody>
								{applications.map((app) => (
									<tr
										key={app._id}
										className="border-t border-white/10 hover:bg-white/20 dark:hover:bg-white/5 transition"
									>
										<td className="p-4 font-semibold text-gray-800 dark:text-white">
											{app.student?.name || "Unknown"}
										</td>

										<td className="p-4 text-gray-600 dark:text-gray-300">
											{app.student?.email || "No Email"}
										</td>

										<td className="p-4 text-gray-600 dark:text-gray-300">
											{app.job?.title || "Deleted Job"}
										</td>

										{/* ✅ RESUME BUTTON */}
										<td className="p-4 text-center">
											{app.resume ? (
												<div className="flex justify-center gap-2">
													{/* VIEW */}
													<a
														href={`http://localhost:5000${app.resume}`}
														target="_blank"
														rel="noopener noreferrer"
														className="px-3 py-1 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														View
													</a>

													{/* DOWNLOAD */}
													<a
														href={`http://localhost:5000${app.resume}`}
														download
														className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
														onClick={(e) =>
															e.stopPropagation()
														}
													>
														Download
													</a>
												</div>
											) : (
												<span className="text-gray-400 text-xs">
													No Resume
												</span>
											)}
										</td>

										<td className="p-4">
											<span
												className={`px-3 py-1 text-xs font-semibold rounded-full ${
													app.status === "selected"
														? "bg-green-200 text-green-800"
														: app.status ===
															  "rejected"
															? "bg-red-200 text-red-800"
															: "bg-yellow-200 text-yellow-800"
												}`}
											>
												{app.status}
											</span>
										</td>

										<td className="p-4 flex justify-center gap-3">
											<button
												disabled={
													app.status === "selected" ||
													actionId === app._id
												}
												onClick={() =>
													updateStatus(
														app._id,
														"selected",
													)
												}
												className="px-4 py-1 text-sm rounded-lg text-white bg-green-500 hover:bg-green-600 disabled:opacity-40"
											>
												{actionId === app._id
													? "..."
													: "Accept"}
											</button>

											<button
												disabled={
													app.status === "rejected" ||
													actionId === app._id
												}
												onClick={() =>
													updateStatus(
														app._id,
														"rejected",
													)
												}
												className="px-4 py-1 text-sm rounded-lg text-white bg-red-500 hover:bg-red-600 disabled:opacity-40"
											>
												{actionId === app._id
													? "..."
													: "Reject"}
											</button>
										</td>
									</tr>
								))}

								{applications.length === 0 && !loading && (
									<tr>
										<td
											colSpan="6"
											className="text-center p-8 text-gray-500 dark:text-gray-400"
										>
											No Applicants Found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default Applicants;
