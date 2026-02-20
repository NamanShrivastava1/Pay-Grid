const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Pay Grid" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Pay Grid!";
  const text = `Hi ${name},\n\nThank you for registering with Pay Grid! We're excited to have you on board.\n\nBest regards,\nThe Pay Grid Team`;
  const html = `<p>Hi ${name},</p><p>Thank you for registering with Pay Grid! We're excited to have you on board.</p><p>Best regards,<br>The Pay Grid Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Alert from Pay Grid";
  const text = `Hi ${name},\n\nYou have successfully transferred ${amount} to account ${toAccount}.\n\nBest regards,\nThe Pay Grid Team`;
  const html = `<p>Hi ${name},</p><p>You have successfully transferred ${amount} to account ${toAccount}.</p><p>Best regards,<br>The Pay Grid Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendFailedTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed Alert from Pay Grid";
  const text = `Hi ${name},\n\nYour transaction to transfer ${amount} to account ${toAccount} has failed. Please check your account and try again.\n\nBest regards,\nThe Pay Grid Team`;
  const html = `<p>Hi ${name},</p><p>Your transaction to transfer ${amount} to account ${toAccount} has failed. Please check your account and try again.</p><p>Best regards,<br>The Pay Grid Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendFailedTransactionEmail,
};
