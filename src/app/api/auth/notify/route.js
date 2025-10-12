import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // Verify the user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, action } = await request.json();
    
    // Usse smtp login and email from brevo
    const senderEmail = "sourav0484@gmail.com";
    const smtpLogin = "989332002@smtp-brevo.com";

    // Create a nodemailer transporter using Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, 
      auth: {
        user: smtpLogin,
        pass: process.env.BREVO_API_KEY, 
      },
      debug: process.env.NODE_ENV !== 'production', 
      logger: process.env.NODE_ENV !== 'production' 
    });


    await transporter.verify().catch(error => {
      console.error("Transporter verification failed:", error);
      throw new Error("Email configuration error: " + error.message);
    });

    // Email content
    const mailOptions = {
      from: `"SeerBharat LMS" <${senderEmail}>`,
      to: email || session.user.email, // for fallback
      subject: "Admin Login Notification - SeerBharat LMS",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a5568; text-align: center;">SeerBharat Learning Management System</h2>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">Admin Login Notification</h3>
            <p style="color: #4a5568;">Hello ${session.user.name || 'Admin'},</p>
            <p style="color: #4a5568;">This is to notify you that your admin account was successfully logged in at ${new Date().toLocaleString()}.</p>
            <p style="color: #4a5568;">If this was not you, please contact the system administrator immediately.</p>
          </div>
          <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 20px;">
            This is an automated message from SeerBharat LMS. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    console.log("Attempting to send email to:", mailOptions.to);
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully:", info.messageId);
    
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Email notification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}