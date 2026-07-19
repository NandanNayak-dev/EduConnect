import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
    try {
        let transporter;

        // If credentials are provided in .env, use them (e.g. Gmail)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter = nodemailer.createTransport({
                service: 'gmail', // or your email service
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        } else {
            // Otherwise, create a dummy Ethereal account for testing
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }

        const info = await transporter.sendMail({
            from: '"EduConnect Notifications" <no-reply@educonnect.com>',
            to,
            subject,
            text,
        });

        console.log("Email sent: %s", info.messageId);
        
        // Preview only available when sending through an Ethereal account
        if (!process.env.EMAIL_USER) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};
