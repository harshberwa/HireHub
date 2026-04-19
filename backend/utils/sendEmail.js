const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, html }) => {
	try {
		const data = await resend.emails.send({
			from: process.env.EMAIL_FROM || "HireHub <onboarding@resend.dev>",
			to: process.env.TEST_EMAIL || email,
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
