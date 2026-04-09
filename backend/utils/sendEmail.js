const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, html }) => {
	try {
		const data = await resend.emails.send({
			from: "HireHub <onboarding@resend.dev>",
			to: email,
			subject,
			html,
		});

		console.log("Email sent:", data);
	} catch (error) {
		console.log("EMAIL ERROR:", error);
		throw error;
	}
};

module.exports = sendEmail;
