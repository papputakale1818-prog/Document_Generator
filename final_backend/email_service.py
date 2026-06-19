
"""
Gmail SMTP email service - used to send password reset OTPs.

SETUP REQUIRED:
1. Enable 2-Step Verification on your Gmail account.
2. Generate an "App Password": Google Account -> Security -> App Passwords.
   (Your normal Gmail login password will NOT work with SMTP.)
3. Set these in your .env file:
   GMAIL_USER=youraddress@gmail.com
   GMAIL_APP_PASSWORD=your16charapppassword
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")


def send_otp_email(to_email: str, otp: str) -> None:
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        raise RuntimeError(
            "GMAIL_USER / GMAIL_APP_PASSWORD not set in environment (.env file)"
        )

    subject = "Your Password Reset OTP"
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#111827;">Password Reset Request</h2>
        <p>Use the OTP below to reset your password. It is valid for 5 minutes.</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px;
                    background:#f1f5f9; padding: 14px 20px; border-radius: 10px;
                    display:inline-block; color:#6366f1;">
          {otp}
        </div>
        <p style="color:#64748b; font-size: 13px; margin-top: 20px;">
          If you did not request this, you can safely ignore this email.
        </p>
      </body>
    </html>
    """

    msg = MIMEMultipart()
    msg["From"] = GMAIL_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_USER, to_email, msg.as_string())
    except Exception as e:
        raise RuntimeError(f"Failed to send OTP email: {str(e)}")

