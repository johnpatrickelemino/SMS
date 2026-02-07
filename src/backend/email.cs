using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace YourProject.Services
{
    public class EmailService
    {
        private const string DefaultSenderEmail = "johnpatrickelemino@gmail.com";
        private const string DefaultSenderPassword = "qheo cjco wfkj wvho";

        private SmtpClient CreateClient()
        {
            return new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(
                    DefaultSenderEmail,
                    DefaultSenderPassword
                ),
                EnableSsl = true
            };
        }

        public async Task SendOtpAsync(string recipientEmail, string otp)
        {
            string htmlBody = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<title>OTP Verification</title>
<style>
body {{
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
}}
.email-container {{
    max-width: 500px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin: auto;
}}
.otp {{
    font-size: 24px;
    font-weight: bold;
    background: #e0e0e0;
    padding: 10px;
    display: inline-block;
}}
</style>
</head>
<body>
<div class='email-container'>
    <h2>🔑 OTP Verification</h2>
    <p>Your OTP code is:</p>
    <div class='otp'>{otp}</div>
    <p>This code is valid for 5 minutes.</p>
</div>
</body>
</html>";

            using var mail = new MailMessage
            {
                From = new MailAddress(DefaultSenderEmail),
                Subject = "OTP Verification",
                Body = htmlBody,
                IsBodyHtml = true
            };

            mail.To.Add(recipientEmail);

            using var client = CreateClient();
            await client.SendMailAsync(mail);
        }

        public async Task SendEnrollmentAsync(
            string email,
            string firstName,
            string lastName,
            string enrollmentDate)
        {
            string htmlBody = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<title>Enrollment Confirmation</title>
</head>
<body style='font-family: Arial; background:#f4f4f4; padding:20px;'>
<div style='max-width:500px; background:#fff; padding:20px; margin:auto;'>
    <h2>🎉 Enrollment Successful</h2>
    <p>Dear {firstName} {lastName},</p>
    <p>You are officially enrolled.</p>
    <p><strong>Enrollment Date:</strong> {enrollmentDate}</p>
    <p>— Student Management System</p>
</div>
</body>
</html>";

            using var mail = new MailMessage
            {
                From = new MailAddress(DefaultSenderEmail),
                Subject = "Enrollment Confirmation",
                Body = htmlBody,
                IsBodyHtml = true
            };

            mail.To.Add(email);

            using var client = CreateClient();
            await client.SendMailAsync(mail);
        }
    }
}
