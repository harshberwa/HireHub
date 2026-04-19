import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";

function Navbar() {
	const [darkMode, setDarkMode] = useState(false);
	const [open, setOpen] = useState(false);
	const [notifOpen, setNotifOpen] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [user, setUser] = useState(null);

	const navigate = useNavigate();
	const dropdownRef = useRef();
	const notifRef = useRef();

	// LOAD USER
	useEffect(() => {
		const loadUser = () => {
			try {
				const token = localStorage.getItem("token");
				const storedUser = localStorage.getItem("user");

				if (token && storedUser) {
					setUser(JSON.parse(storedUser));
				} else {
					setUser(null);
				}
			} catch {
				setUser(null);
			}
		};

		loadUser();
		window.addEventListener("storage", loadUser);

		return () => window.removeEventListener("storage", loadUser);
	}, []);

	// FETCH NOTIFICATIONS
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const res = await fetch("/api/notifications", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});

				const data = await res.json();
				setNotifications(data.notifications || []);
			} catch {
				setNotifications([]);
			}
		};

		if (user) fetchNotifications();
	}, [user]);

	// DARK MODE
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");

		if (savedTheme === "dark") {
			document.documentElement.classList.add("dark");
			setDarkMode(true);
		}
	}, []);

	// CLOSE DROPDOWNS ON OUTSIDE CLICK
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setOpen(false);
			}

			if (notifRef.current && !notifRef.current.contains(event.target)) {
				setNotifOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// THEME TOGGLE
	const toggleDarkMode = () => {
		if (darkMode) {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		} else {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		}

		setDarkMode(!darkMode);
	};

	// LOGOUT
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		setOpen(false);
		setNotifOpen(false);
		navigate("/login");
	};

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<nav className="relative z-50 bg-white dark:bg-gray-900 shadow-md">
			<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
				{/* LOGO */}
				<Link to="/">
					<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
						Hire<span>Hub</span>
					</h1>
				</Link>

				<div className="flex items-center space-x-5">
					{/* COMMON LINKS */}
					{(!user ||
						user.role === "student" ||
						user.role === "hr") && (
						<Link
							to="/jobs"
							className="text-gray-900 dark:text-white font-medium"
						>
							Jobs
						</Link>
					)}

					{/* STUDENT TOP LINKS */}
					{user?.role === "student" && (
						<>
							<Link
								to="/saved-jobs"
								className="text-gray-900 dark:text-white font-medium"
							>
								Saved Jobs
							</Link>
							<Link
								to="/my-applications"
								className="text-gray-900 dark:text-white font-medium"
							>
								My Applications
							</Link>
						</>
					)}

					{/* HR TOP LINKS */}
					{user?.role === "hr" && (
						<>
							<Link
								to="/post-job"
								className="text-gray-900 dark:text-white font-medium"
							>
								Post Job
							</Link>
							<Link
								to="/my-jobs"
								className="text-gray-900 dark:text-white font-medium"
							>
								My Jobs
							</Link>
							<Link
								to="/hr-dashboard"
								className="text-gray-900 dark:text-white font-medium"
							>
								HR Dashboard
							</Link>
						</>
					)}

					{/* ADMIN TOP LINKS */}
					{user?.role === "admin" && (
						<>
							<Link
								to="/admin"
								className="text-gray-900 dark:text-white font-medium"
							>
								Dashboard
							</Link>
							<Link
								to="/admin/users"
								className="text-gray-900 dark:text-white font-medium"
							>
								Users
							</Link>
							<Link
								to="/admin/jobs"
								className="text-gray-900 dark:text-white font-medium"
							>
								Jobs
							</Link>
							<Link
								to="/admin/hr-approval"
								className="text-gray-900 dark:text-white font-medium"
							>
								HR Approval
							</Link>
						</>
					)}

					{/* NOTIFICATIONS */}
					{user && (
						<div className="relative" ref={notifRef}>
							<div
								onClick={() => {
									setNotifOpen(!notifOpen);
									setOpen(false);
								}}
								className="cursor-pointer relative"
							>
								<FaBell className="text-gray-900 dark:text-white text-lg" />

								{unreadCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
										{unreadCount}
									</span>
								)}
							</div>

							{notifOpen && (
								<div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl py-2 z-[999]">
									<p className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white">
										Notifications
									</p>

									{notifications.length === 0 ? (
										<p className="px-4 py-2 text-sm text-gray-500">
											No notifications
										</p>
									) : (
										notifications.map((n) => (
											<div
												key={n._id}
												className="px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												{n.message}
											</div>
										))
									)}
								</div>
							)}
						</div>
					)}

					{/* GUEST LINKS */}
					{!user && (
						<>
							<Link
								to="/login"
								className="text-gray-900 dark:text-white font-medium"
							>
								Login
							</Link>

							<Link
								to="/register"
								className="bg-blue-600 dark:bg-purple-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-purple-700 transition"
							>
								Register
							</Link>
						</>
					)}

					{/* USER DROPDOWN */}
					{user && (
						<div className="relative" ref={dropdownRef}>
							<div
								onClick={() => {
									setOpen(!open);
									setNotifOpen(false);
								}}
								className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer"
							>
								{user.name?.charAt(0).toUpperCase()}
							</div>

							{open && (
								<div className="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-800 shadow-lg rounded-xl py-2 z-[999]">
									<Link
										to="/profile"
										onClick={() => setOpen(false)}
										className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
									>
										Profile
									</Link>

									{user.role === "student" && (
										<>
											<Link
												to="/saved-jobs"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												Saved Jobs
											</Link>

											<Link
												to="/my-applications"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												My Applications
											</Link>
										</>
									)}

									{user.role === "hr" && (
										<>
											<Link
												to="/post-job"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												Post Job
											</Link>

											<Link
												to="/my-jobs"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												My Jobs
											</Link>

											<Link
												to="/hr-dashboard"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												HR Dashboard
											</Link>
										</>
									)}

									{user.role === "admin" && (
										<>
											<Link
												to="/admin"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												Dashboard
											</Link>

											<Link
												to="/admin/users"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												Users
											</Link>

											<Link
												to="/admin/jobs"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												Jobs
											</Link>

											<Link
												to="/admin/hr-approval"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												HR Approval
											</Link>

											<Link
												to="/admin/analytics"
												onClick={() => setOpen(false)}
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
											>
												Analytics 📊
											</Link>
										</>
									)}

									<button
										onClick={handleLogout}
										className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
									>
										Logout
									</button>
								</div>
							)}
						</div>
					)}

					{/* THEME */}
					<button
						onClick={toggleDarkMode}
						className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
					>
						{darkMode ? (
							<FaSun className="text-yellow-500" />
						) : (
							<FaMoon className="text-gray-900 dark:text-white" />
						)}
					</button>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
