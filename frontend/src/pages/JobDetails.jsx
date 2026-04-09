import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function JobDetails() {
	const { id } = useParams();

	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);
	const [applied, setApplied] = useState(false);
	const [loadingApply, setLoadingApply] = useState(false);

	const user = JSON.parse(localStorage.getItem("user") || "null");

	// ✅ FETCH JOB DETAILS
	useEffect(() => {
		const fetchJob = async () => {
			try {
				const res = await API.get(`/jobs/${id}`);
				setJob(res.data.job);
			} catch (error) {
				console.log(error);
				toast.error("Failed to load job");
			} finally {
				setLoading(false);
			}
		};

		fetchJob();
	}, [id]);

	// ✅ CHECK IF ALREADY APPLIED
	useEffect(() => {
		const checkApplied = async () => {
			try {
				if (user?.role === "student") {
					const res = await API.get("/applications/my");

					const appliedIds =
						res.data.applications
							.map((app) => app.job?._id)
							.filter(Boolean) || [];

					setApplied(appliedIds.includes(id));
				}
			} catch (err) {
				console.log(err);
			}
		};

		checkApplied();
	}, [id, user]);

	// ✅ APPLY
	const handleApply = async () => {
		try {
			setLoadingApply(true);

			await API.post("/applications", { jobId: id });

			toast.success("Applied successfully 🚀");
			setApplied(true);
		} catch (error) {
			toast.error(error.response?.data?.message || "Apply failed");
		} finally {
			setLoadingApply(false);
		}
	};

	// ✅ LOADING UI
	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen text-xl text-gray-700 dark:text-gray-300">
				Loading job details...
			</div>
		);
	}

	// ❌ NO JOB
	if (!job) {
		return (
			<div className="text-center mt-20 text-xl text-gray-700 dark:text-gray-300">
				Job not found ❌
			</div>
		);
	}

	return (
		<div className="min-h-screen px-6 md:px-12 py-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			<div className="max-w-4xl mx-auto bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
				{/* HEADER */}
				<h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
					{job.title}
				</h1>

				<p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
					{job.company}
				</p>

				{/* DETAILS GRID */}
				<div className="grid md:grid-cols-2 gap-4 mb-6">
					<p className="text-gray-700 dark:text-gray-300">
						<b>📍 Location:</b> {job.location}
					</p>

					<p className="text-green-600 font-semibold">
						💰 Salary:{" "}
						{job.salary
							? `₹${new Intl.NumberFormat("en-IN").format(job.salary)} ${
									job.salaryType === "monthly"
										? "/month"
										: "/year"
								}`
							: "Not Disclosed"}
					</p>

					<p className="text-gray-700 dark:text-gray-300">
						<b>👤 Posted By:</b> {job.postedBy?.name || "HR"}
					</p>

					<p className="text-gray-700 dark:text-gray-300">
						<b>📅 Posted On:</b>{" "}
						{new Date(job.createdAt).toLocaleDateString()}
					</p>
				</div>

				{/* DESCRIPTION */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
						Job Description
					</h2>

					<p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
						{job.description}
					</p>
				</div>

				{/* ACTION BUTTON */}
				{user?.role === "student" && (
					<button
						onClick={handleApply}
						disabled={applied || loadingApply}
						className={`w-full py-3 rounded-xl text-white text-lg font-semibold transition ${
							applied
								? "bg-gray-400 cursor-not-allowed"
								: "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]"
						}`}
					>
						{loadingApply
							? "Applying..."
							: applied
								? "Already Applied ✅"
								: "Apply Now 🚀"}
					</button>
				)}

				{/* 🔥 EXTRA SMALL UX TOUCH (NO UI CHANGE) */}
				{user?.role === "hr" && (
					<p className="text-center mt-6 text-sm text-gray-500">
						You posted this job or can view applicants from
						dashboard
					</p>
				)}
			</div>
		</div>
	);
}

export default JobDetails;
