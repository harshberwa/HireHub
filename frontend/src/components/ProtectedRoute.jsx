import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
	const token = localStorage.getItem("token");
	const user = JSON.parse(localStorage.getItem("user") || "null");

	// ❌ No token
	if (!token) {
		return <Navigate to="/login" replace />;
	}

	// ❌ Role mismatch
	if (role && user?.role !== role) {
		return <Navigate to="/" replace />;
	}

	// ✅ Allowed
	return children;
}

export default ProtectedRoute;
