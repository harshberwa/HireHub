import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Jobs() {
	const [jobs, setJobs] = useState([]);
	const [appliedJobs, setAppliedJobs] = useState([]);
	const [savedJobs, setSavedJobs] = useState([]);

	const [loading, setLoading] = useState(true);
	const [loadingId, setLoadingId] = useState(null);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const [keyword, setKeyword] = useState("");
	const [location, setLocation] = useState("");
	const [minSalary, setMinSalary] = useState("");
	const [sort, setSort] = useState("latest");

	const [filters, setFilters] = useState({
		keyword: "",
		location: "",
		minSalary: "",
		sort: "latest",
	});

	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user") || "null");

	// 🔥 DEBOUNCE
	useEffect(() => {
		const timer = setTimeout(() => {
			setFilters({ keyword, location, minSalary, sort });
			setPage(1);
		}, 800);

		return () => clearTimeout(timer);
	}, [keyword, location, minSalary, sort]);

	// ✅ FETCH JOBS
	useEffect(() => {
		const fetchJobs = async () => {
			try {
				setLoading(true);

				const res = await API.get(
					`/jobs?page=${page}&limit=6&keyword=${filters.keyword}&location=${filters.location}&minSalary=${filters.minSalary}&sort=${filters.sort}`,
				);

				setJobs(res.data.jobs || []);
				setTotalPages(res.data.totalPages || 1);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		fetchJobs();
	}, [page, filters]);

	// ✅ FETCH APPLIED JOBS
	useEffect(() => {
		const fetchAppliedJobs = async () => {
			try {
				if (user?.role === "student") {
					const res = await API.get("/applications/my");

					const appliedIds =
						res.data.applications
							.map((app) => app.job?._id?.toString())
							.filter(Boolean) || [];

					setAppliedJobs(appliedIds);
				}
			} catch (err) {
				console.log(err);
			}
		};

		fetchAppliedJobs();
	}, [user]);

	// ✅ FETCH SAVED JOBS
	useEffect(() => {
		const fetchSaved = async () => {
			try {
				const res = await API.get("/users/saved-jobs");

				const ids = res.data.jobs.map((job) => job._id.toString());

				setSavedJobs(ids);
			} catch (err) {
				console.log(err);
			}
		};

		if (user) fetchSaved();
	}, [user]);

	// ✅ APPLY JOB
	const handleApply = async (jobId) => {
		try {
			setLoadingId(jobId);

			await API.post("/applications", { jobId });

			toast.success("Applied successfully 🚀");

			setAppliedJobs((prev) => [...new Set([...prev, jobId.toString()])]);
		} catch (error) {
			toast.error(error.response?.data?.message || "Apply failed");
		} finally {
			setLoadingId(null);
		}
	};

	// ✅ SAVE JOB
	const handleSave = async (jobId) => {
		try {
			const res = await API.post(`/users/save-job/${jobId}`);

			const ids = res.data.savedJobs.map((id) => id.toString());

			setSavedJobs(ids);

			toast.success("Updated Saved Jobs ❤️");
		} catch {
			toast.error("Failed to update");
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen text-xl text-gray-700 dark:text-gray-300">
				Loading jobs...
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex justify-center items-center h-screen text-xl text-gray-700 dark:text-gray-300">
				Please login to view jobs 🔒
			</div>
		);
	}

	return (
		<div className="px-6 md:px-10 py-12 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			{/* 🔥 HEADING (MATCHED) */}
			<h2 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-purple-400">
				Available Jobs
			</h2>

			{/* 🔥 FILTERS (GLASS STYLE) */}
			<div className="max-w-5xl mx-auto mb-10 grid md:grid-cols-4 gap-4 backdrop-blur-xl bg-white/60 dark:bg-white/5 p-4 rounded-2xl border border-white/20 shadow">
				<input
					type="text"
					placeholder="Search..."
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white outline-none"
				/>

				<input
					type="text"
					placeholder="Location..."
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white outline-none"
				/>

				<input
					type="number"
					placeholder="Min Salary"
					value={minSalary}
					onChange={(e) => setMinSalary(e.target.value)}
					className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white outline-none"
				/>

				<select
					value={sort}
					onChange={(e) => setSort(e.target.value)}
					className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white outline-none"
				>
					<option value="latest">Latest</option>
					<option value="salary_high">Salary High → Low</option>
					<option value="salary_low">Salary Low → High</option>
				</select>
			</div>

			{/* 🔥 JOB LIST (MATCHED WITH MYJOBS) */}
			<div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{jobs.map((job) => {
					const isApplied = appliedJobs.includes(job._id.toString());
					const isSaved = savedJobs.includes(job._id.toString());

					return (
						<div
							key={job._id}
							onClick={() => navigate(`/jobs/${job._id}`)}
							className="cursor-pointer flex flex-col justify-between min-h-[280px] backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
						>
							<div>
								<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
									{job.title}
								</h3>

								<p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
									{job.description}
								</p>

								<p className="text-sm text-gray-500 dark:text-gray-400">
									<b>Company:</b> {job.company}
								</p>

								<p className="text-sm text-gray-500 dark:text-gray-400">
									<b>Location:</b> {job.location}
								</p>

								<p className="text-green-500 font-semibold mt-2">
									Salary:{" "}
									{job.salary
										? `₹${new Intl.NumberFormat("en-IN").format(job.salary)} ${
												job.salaryType === "monthly"
													? "/month"
													: "/year"
											}`
										: "Not Disclosed"}
								</p>
							</div>

							<div className="mt-5 space-y-2">
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleSave(job._id);
									}}
									className="w-full py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
								>
									{isSaved ? "Unsave Job" : "Save Job ❤️"}
								</button>

								{user?.role === "student" && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleApply(job._id);
										}}
										disabled={
											isApplied || loadingId === job._id
										}
										className={`w-full py-2 rounded-lg text-white font-medium ${
											isApplied
												? "bg-gray-400"
												: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
										}`}
									>
										{loadingId === job._id
											? "Applying..."
											: isApplied
												? "Applied"
												: "Apply Now"}
									</button>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* PAGINATION */}
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
		</div>
	);
}

export default Jobs;
