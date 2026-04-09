function ConfirmModal({ message, onConfirm, onCancel }) {
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="w-full max-w-md p-6 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-white/10 border border-white/20 shadow-2xl">
				<h2 className="text-xl font-bold mb-4 text-center text-red-500">
					Confirm Action
				</h2>

				<p className="text-center text-gray-700 dark:text-gray-300 mb-6">
					{message}
				</p>

				<div className="flex gap-3">
					{/* CANCEL */}
					<button
						onClick={onCancel}
						className="w-full py-2 rounded-lg bg-gray-400 text-white"
					>
						Cancel
					</button>

					{/* CONFIRM */}
					<button
						onClick={onConfirm}
						className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition"
					>
						Yes, Delete
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmModal;
