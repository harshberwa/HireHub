import { useEffect, useState } from "react";
import API from "../services/api";

function MyApplications() {
	const [applications, setApplications] = useState([]);

	// ✅ PAGINATION
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const limit = 6;

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const res = await API.get(
					`/applications/my?page=${page}&limit=${limit}`,
				);

				setApplications(res.data.applications || []);
				setTotalPages(res.data.totalPages || 1);
			} catch (error) {
				console.log(error);
			}
		};

		fetchApplications();
	}, [page]);

	return (
		<div className="px-6 md:px-10 py-12 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			{/* TITLE */}
			<h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				My Applications
			</h2>

			{/* GRID */}
			<div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{applications.map((app) => (
					<div
						key={app._id}
						className="flex flex-col justify-between min-h-[220px] backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
					>
						<div>
							<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
								{app.job?.title || "Job Removed"}
							</h3>

							<p className="text-gray-600 dark:text-gray-300">
								{app.job?.company || "Unknown Company"}
							</p>

							<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
								{app.job?.location || "Location not available"}
							</p>
						</div>

						<div className="mt-4">
							<span
								className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
									app.status === "selected"
										? "bg-green-500/20 text-green-400 border border-green-500/30"
										: app.status === "rejected"
											? "bg-red-500/20 text-red-400 border border-red-500/30"
											: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
								}`}
							>
								{app.status}
							</span>
						</div>
					</div>
				))}

				{/* EMPTY */}
				{applications.length === 0 && (
					<p className="text-center col-span-full text-gray-500 dark:text-gray-400 text-lg">
						You have not applied to any jobs yet.
					</p>
				)}
			</div>

			{/* ✅ PAGINATION UI */}
			{totalPages > 1 && (
				<div className="flex justify-center mt-10 gap-4">
					<button
						disabled={page === 1}
						onClick={() => setPage(page - 1)}
						className="px-4 py-2 bg-gray-300 rounded"
					>
						Prev
					</button>

					<span className="text-lg font-semibold">
						{page} / {totalPages}
					</span>

					<button
						disabled={page === totalPages}
						onClick={() => setPage(page + 1)}
						className="px-4 py-2 bg-gray-300 rounded"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
}

export default MyApplications;
