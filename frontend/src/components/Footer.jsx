function Footer() {
	return (
		<footer className="backdrop-blur-md bg-transparent border-t border-white/10 ">
			<div className="max-w-7xl mx-auto px-6 py-8 text-center mb-6">
				{/* TOP GRADIENT LINE */}
				<div className="h-[2px] w-full mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>

				{/* LOGO */}
				<h2 className="text-xl font-bold text-blue-600 dark:text-purple-400 tracking-wide">
					HireHub 🚀
				</h2>

				{/* TAGLINE */}
				<p className="text-gray-500 text-sm mt-2">
					Connecting Students with Opportunities
				</p>

				{/* COPYRIGHT */}
				<p className="text-gray-500 text-xs mt-5">
					© {new Date().getFullYear()} HireHub. All rights reserved.
				</p>
			</div>
		</footer>
	);
}

export default Footer;
