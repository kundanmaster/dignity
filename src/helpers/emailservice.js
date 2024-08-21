// utils/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: "rajat.masterbazar@gmail.com",
    pass: "vnqgjngheyquciha",
  },
});

export const sendEmail = async (data) => {
  try {
    await transporter.sendMail({
      from: "rajat.masterbazar@gmail.com",
      to: "rajat.masterbazar@gmail.com",
      subject: "Contact Us Form Submission",
      text: `Name: ${data.name}\nEmail: ${data.email}\nDate: ${data.date}\nTme: ${data.time}`,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
