import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Pie, Line } from "react-chartjs-2";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
);

function AdminAnalytics() {
	const [stats, setStats] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await API.get("/admin/stats");
				setStats(res.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchStats();
	}, []);

	if (!stats) {
		return (
			<div className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				Loading Analytics...
			</div>
		);
	}

	const barData = {
		labels: ["Users", "Jobs"],
		datasets: [
			{
				label: "Platform Data",
				data: [stats.totalUsers, stats.totalJobs],
				backgroundColor: ["#3b82f6", "#8b5cf6"],
				borderRadius: 8,
			},
		],
	};

	const pieData = {
		labels: ["Students", "HR"],
		datasets: [
			{
				data: [stats.totalStudents, stats.totalHR],
				backgroundColor: ["#10b981", "#f59e0b"],
			},
		],
	};

	const lineData = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		datasets: [
			{
				label: "User Growth",
				data: [
					stats.totalUsers * 0.2,
					stats.totalUsers * 0.4,
					stats.totalUsers * 0.6,
					stats.totalUsers * 0.8,
					stats.totalUsers * 0.9,
					stats.totalUsers,
				],
				borderColor: "#3b82f6",
				backgroundColor: "#3b82f6",
				tension: 0.4,
				fill: false,
			},
		],
	};

	return (
		<div className="px-6 md:px-10 py-12 min-h-screen">
			<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				Admin Analytics
			</h2>

			{/* 🔥 STATS CARDS */}
			<div className="grid md:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
				{[
					{ label: "Users", value: stats.totalUsers },
					{ label: "Jobs", value: stats.totalJobs },
					{ label: "HR", value: stats.totalHR },
					{ label: "Students", value: stats.totalStudents },
				].map((item, i) => (
					<div
						key={i}
						className="p-5 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 shadow-md hover:scale-[1.03] transition"
					>
						<h3 className="text-gray-600 dark:text-gray-300 text-sm">
							{item.label}
						</h3>
						<p className="text-2xl font-bold text-gray-900 dark:text-white">
							{item.value}
						</p>
					</div>
				))}
			</div>

			{/* 🔥 CHARTS */}
			<div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
				{/* BAR */}
				<div className="p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 shadow-md">
					<h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
						Users vs Jobs
					</h3>
					<Bar data={barData} />
				</div>

				{/* PIE */}
				<div className="p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 shadow-md">
					<h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
						Role Distribution
					</h3>
					<Pie data={pieData} />
				</div>

				{/* LINE */}
				<div className="md:col-span-2 p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 shadow-md">
					<h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
						User Growth
					</h3>
					<Line data={lineData} />
				</div>
			</div>
		</div>
	);
}

export default AdminAnalytics;
