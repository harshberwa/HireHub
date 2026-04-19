import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

import { Toaster } from "react-hot-toast";

import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";
import AdminHR from "./pages/AdminHR";
import AdminAnalytics from "./pages/AdminAnalytics";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import Applicants from "./pages/Applicants";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import HrDashboard from "./pages/HrDashboard";
import MyJobs from "./pages/MyJobs";

import VerifyEmail from "./pages/VerifyEmail";

import useAutoLogout from "./hooks/useAutoLogout";

// ✅ Wrapper (IMPORTANT)
function AutoLogoutWrapper() {
	useAutoLogout();
	return null;
}

function App() {
	return (
		<Router>
			{/* ✅ Toast */}
			<Toaster position="top-right" />

			{/* ✅ Auto Logout Hook */}
			<AutoLogoutWrapper />

			<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 transition-all duration-300">
				<Navbar />

				{/* MAIN CONTENT */}
				<div className="flex-grow">
					<Routes>
						{/* PUBLIC ROUTES */}
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/verify-email" element={<VerifyEmail />} />

						{/* ================= ADMIN ================= */}
						<Route
							path="/admin"
							element={
								<ProtectedRoute role="admin">
									<AdminPanel />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin/users"
							element={
								<ProtectedRoute role="admin">
									<AdminUsers />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin/jobs"
							element={
								<ProtectedRoute role="admin">
									<AdminJobs />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin/hr-approval"
							element={
								<ProtectedRoute role="admin">
									<AdminHR />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin/analytics"
							element={
								<ProtectedRoute role="admin">
									<AdminAnalytics />
								</ProtectedRoute>
							}
						/>

						{/* ================= JOBS ================= */}
						<Route
							path="/jobs"
							element={
								<ProtectedRoute>
									<Jobs />
								</ProtectedRoute>
							}
						/>

						<Route path="/saved-jobs" element={<SavedJobs />} />

						<Route
							path="/jobs/:id"
							element={
								<ProtectedRoute>
									<JobDetails />
								</ProtectedRoute>
							}
						/>

						{/* ================= HR ================= */}
						<Route
							path="/post-job"
							element={
								<ProtectedRoute role="hr">
									<PostJob />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/applicants/:jobId"
							element={
								<ProtectedRoute role="hr">
									<Applicants />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/hr-dashboard"
							element={
								<ProtectedRoute role="hr">
									<HrDashboard />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/my-jobs"
							element={
								<ProtectedRoute role="hr">
									<MyJobs />
								</ProtectedRoute>
							}
						/>

						{/* ================= STUDENT ================= */}
						<Route
							path="/my-applications"
							element={
								<ProtectedRoute role="student">
									<MyApplications />
								</ProtectedRoute>
							}
						/>

						{/* ================= COMMON ================= */}
						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<Profile />
								</ProtectedRoute>
							}
						/>

						{/* 404 */}
						<Route
							path="*"
							element={
								<h1 className="text-center mt-20 text-3xl font-bold text-gray-700 dark:text-gray-300">
									404 Page Not Found
								</h1>
							}
						/>
					</Routes>
				</div>

				<Footer />
			</div>
		</Router>
	);
}

export default App;
