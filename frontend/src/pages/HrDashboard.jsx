import { useEffect, useState } from "react";
import API from "../services/api";

function HrDashboard() {
	const [stats, setStats] = useState({
		totalJobs: 0,
		totalApplicants: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await API.get("/jobs/my-jobs");
				const jobs = res.data.jobs || [];

				let applicants = 0;
				jobs.forEach((job) => {
					applicants += job.applicants?.length || 0;
				});

				setStats({
					totalJobs: jobs.length,
					totalApplicants: applicants,
				});
			} catch (err) {
				console.log(err);
			}
		};

		fetchStats();
	}, []);

	return (
		<div className="min-h-screen px-6 py-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
			<h1 className="text-4xl font-bold text-center mb-12 text-blue-600 dark:text-purple-400">
				HR Dashboard
			</h1>

			<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				<div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition">
					<h2 className="text-lg text-gray-600 dark:text-gray-300">
						Total Jobs
					</h2>
					<p className="text-4xl font-bold text-blue-600 dark:text-purple-400 mt-2">
						{stats.totalJobs}
					</p>
				</div>

				<div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition">
					<h2 className="text-lg text-gray-600 dark:text-gray-300">
						Total Applicants
					</h2>
					<p className="text-4xl font-bold text-green-500 mt-2">
						{stats.totalApplicants}
					</p>
				</div>
			</div>
		</div>
	);
}

export default HrDashboard;
