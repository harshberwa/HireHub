import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function AdminHR() {
	const [hrs, setHrs] = useState([]);
	const [loading, setLoading] = useState(true);

	// ✅ FETCH PENDING HR
	const fetchHR = async () => {
		try {
			const res = await API.get("/admin/pending-hr"); // ✅ FIXED

			// ✅ backend sends { hrUsers: [...] }
			setHrs(res.data.hrUsers || []);
		} catch (error) {
			console.log(error);
			setHrs([]); // safety
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHR();
	}, []);

	// ✅ APPROVE
	const handleApprove = async (id) => {
		try {
			await API.put(`/admin/approve-hr/${id}`); // ✅ FIXED

			toast.success("HR Approved ✅");

			setHrs((prev) => prev.filter((hr) => hr._id !== id));
		} catch (error) {
			toast.error("Error approving HR");
		}
	};

	// ❌ REJECT
	const handleReject = async (id) => {
		try {
			await API.delete(`/admin/reject-hr/${id}`); // ✅ FIXED

			toast.success("HR Rejected ❌");

			setHrs((prev) => prev.filter((hr) => hr._id !== id));
		} catch (error) {
			toast.error("Error rejecting HR");
		}
	};

	if (loading) {
		return (
			<div className="text-center mt-20 text-xl">
				Loading HR requests...
			</div>
		);
	}

	return (
		<div className="p-8 min-h-screen">
			<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
				HR Approval Requests
			</h2>

			{!Array.isArray(hrs) || hrs.length === 0 ? (
				<p className="text-center text-gray-500">
					No pending HR requests
				</p>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{hrs.map((hr) => (
						<div
							key={hr._id}
							className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
						>
							<h3 className="text-xl font-semibold text-gray-800 dark:text-white">
								{hr.name}
							</h3>

							<p className="text-gray-600 dark:text-gray-300">
								{hr.email}
							</p>

							<div className="flex gap-3 mt-5">
								<button
									onClick={() => handleApprove(hr._id)}
									className="flex-1 py-2 bg-green-500 text-white rounded-lg"
								>
									Approve
								</button>

								<button
									onClick={() => handleReject(hr._id)}
									className="flex-1 py-2 bg-red-500 text-white rounded-lg"
								>
									Reject
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default AdminHR;
