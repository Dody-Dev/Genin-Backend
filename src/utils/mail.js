import nodemailer from 'nodemailer';

export const sendEmail = async (options) =>{
    const transporter = nodemailer.createTransport({

        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,        
    };

    await transporter.addMail(message);
}









// // This is our main function for sending an email. We'll call this from our controllers.
// // It's an 'async' function because sending an email takes a moment to complete.
// export const sendEmail = async (options) => {
//   // We create a 'transporter' object. This is like our vehicle for sending mail.
//   // It needs to be configured with the details of the email service we're using.
//   const transporter = nodemailer.createTransport({
//     // Here we tell it who our email service provider is and what port to use.
//     // We grab this info securely from our environment variables.
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     // The 'secure' flag tells it to use a secure connection, which is important for privacy.
//     secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
//     // And finally, we provide our login credentials so the service knows who we are.
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   // Now we create the email content itself—the 'message'.
//   const message = {
//     // This is the sender's info. We're telling the email client who the email is from.
//     from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
//     // This is the recipient, which is passed into our function.
//     to: options.email,
//     // The subject line of the email.
//     subject: options.subject,
//     // The main body of the email in plain text.
//     text: options.message,
//   };

//   // This is the final step! We tell our 'transporter' vehicle to send the 'message'.
//   // We use 'await' because we need to wait for this action to finish before moving on.
//   await transporter.sendMail(message);
// };
