import { useNavigate } from "react-router-dom";

function Home() {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));

	const handleExplore = () => {
		if (!user) {
			navigate("/register");
		} else {
			navigate("/jobs");
		}
	};

	return (
		<div className="flex items-center justify-center px-6 py-20">
			<div className="max-w-4xl text-center">
				<h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight max-w-2xl mx-auto">
					Welcome to{" "}
					<span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
						HireHub
					</span>
				</h1>

				<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
					HireHub connects students with hiring companies through a
					fast, secure, and modern recruitment platform. Students can
					discover jobs and apply with ease, while HR professionals
					can post openings, review applicants, and streamline hiring
					in one place.
				</p>

				<button
					onClick={handleExplore}
					className="px-10 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 transition duration-300 shadow-lg hover:scale-105"
				>
					Explore Opportunities
				</button>
			</div>
		</div>
	);
}

export default Home;
