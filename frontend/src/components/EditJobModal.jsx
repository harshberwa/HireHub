import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function EditJobModal({ job, onClose, onUpdate }) {
	const [form, setForm] = useState({
		title: "",
		description: "",
		company: "",
		location: "",
		salary: "",
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (job) {
			setForm({
				title: job.title || "",
				description: job.description || "",
				company: job.company || "",
				location: job.location || "",
				salary: job.salary || "",
			});
		}
	}, [job]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleUpdate = async () => {
		try {
			setLoading(true);

			const res = await API.put(`/jobs/${job._id}`, form);

			onUpdate(res.data.job);
			toast.success("Job updated ✨");
			onClose();
		} catch (err) {
			toast.error("Update failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="w-full max-w-lg p-6 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/20 shadow-2xl">
				<h2 className="text-2xl font-bold mb-5 text-center text-blue-600 dark:text-purple-400">
					Edit Job
				</h2>

				<div className="space-y-4">
					<input
						name="title"
						value={form.title}
						onChange={handleChange}
						placeholder="Job Title"
						className="w-full p-3 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<input
						name="company"
						value={form.company}
						onChange={handleChange}
						placeholder="Company"
						className="w-full p-3 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<input
						name="location"
						value={form.location}
						onChange={handleChange}
						placeholder="Location"
						className="w-full p-3 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<input
						name="salary"
						value={form.salary}
						onChange={handleChange}
						placeholder="Salary"
						className="w-full p-3 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<textarea
						name="description"
						value={form.description}
						onChange={handleChange}
						placeholder="Description"
						rows={4}
						className="w-full p-3 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex gap-3 mt-6">
					<button
						onClick={handleUpdate}
						disabled={loading}
						className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
					>
						{loading ? "Updating..." : "Update"}
					</button>

					<button
						onClick={onClose}
						className="w-full py-2 rounded-lg bg-gray-400 text-white"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}

export default EditJobModal;
