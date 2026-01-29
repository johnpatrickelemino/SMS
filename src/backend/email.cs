using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;

class backend
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private const string DefaultSenderEmail = "johnpatrickelemino@gmail.com";
        private const string DefaultSenderPassword = "qheo cjco wfkj wvho";

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string recipientEmail, string OTP)
        {
            try
            {
                string senderEmail = DefaultSenderEmail;
                string senderPassword = DefaultSenderPassword;

                using (SmtpClient client = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(senderEmail, senderPassword),
                    EnableSsl = true
                })
                {
                    string htmlBody = @$"
                       <html lang=""en"">
                                <head> 
                                    <meta charset=""UTF-8"">
                                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                                    <title>OTP Verification</title>
                                    <style>
                                        body {{
                                            font-family: Arial, sans-serif;
                                            background-color: #f4f4f4;
                                            padding: 20px;
                                            text-align: center;
                                        }}
                                        .email-container {{
                                            max-width: 500px;
                                            background: #fff;
                                            padding: 20px;
                                            border-radius: 8px;
                                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                                            margin: auto;
                                        }}
                                        .otp-code {{
                                            font-size: 24px;
                                            font-weight: bold;
                                            color: #333;
                                            padding: 10px;
                                            background: #e0e0e0;
                                            border-radius: 5px;
                                            display: inline-block;
                                            margin: 10px 0;
                                        }}
                                        .footer {{
                                            font-size: 12px;
                                            color: #666;
                                            margin-top: 20px;
                                        }}
                                    </style>
                                </head>
                                <body>
                                    <div class=""email-container"">
                                        <h2>🔑 Your One-Time Password (OTP)</h2>
                                        <p>Use the following OTP to verify your identity:</p>
                                        <div class=""otp-code"">{OTP}</div>
                                        <p>This code is valid for 5 minutes.</p>
                                        <p class=""footer"">© 2025 Your Company. All rights reserved.</p>
                                    </div>
                                </body>
                                </html>";
                    
                    using (MailMessage mail = new MailMessage
                    {
                        From = new MailAddress(senderEmail),
                        Subject = "OTP Verification",
                        Body = htmlBody,
                        IsBodyHtml = true
                    })
                    {
                        mail.To.Add(recipientEmail);
                        await client.Send(mail);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw;
            }
        }

        public async Task SendEnrollmentConfirmationAsync(string email, string firstName, string lastName, string enrollmentDate)
        {
            try
            {
                string senderEmail = DefaultSenderEmail;
                string senderPassword = DefaultSenderPassword;
                
                using (SmtpClient client = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(senderEmail, senderPassword),
                    EnableSsl = true
                })
                {
                    string htmlBody = $@"
                       <html lang=""en"">
                                <head> 
                                    <meta charset=""UTF-8"">
                                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                                    <title>Enrollment Confirmation</title>
                                    <style>
                                        body {{
                                            font-family: Arial, sans-serif;
                                            background-color: #f4f4f4;
                                            padding: 20px;
                                            text-align: center;
                                        }}
                                        .email-container {{
                                            max-width: 500px;
                                            background: #fff;
                                            padding: 20px;
                                            border-radius: 8px;
                                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                                            margin: auto;
                                        }}
                                        .footer {{
                                            font-size: 12px;
                                            color: #666;
                                            margin-top: 20px;
                                        }}
                                    </style>
                                </head>
                                <body>
                                    <div class=""email-container"">
                                        <h2>🎉 Enrollment Successful!</h2>
                                        <p>Dear {firstName} {lastName},</p>
                                        <p>We are pleased to confirm that you have successfully enrolled in our system.</p>
                                        <div style='background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                                            <p><strong>Enrollment Date:</strong> {enrollmentDate}</p>
                                        </div>
                                        <p>You can now access all course materials and resources on your student dashboard. If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                                        <p>Best regards,<br/>Student Management System Team</p>
                                        <p class=""footer"">© 2025 Your Company. All rights reserved.</p>
                                    </div>
                                </body>
                            </html>";
                    
                    using (MailMessage mail = new MailMessage
                    {
                        From = new MailAddress(senderEmail),
                        Subject = "Enrollment Confirmation",
                        Body = htmlBody,
                        IsBodyHtml = true
                    })
                    {
                        mail.To.Add(email);
                        await client.Send(mail);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending enrollment email: {ex.Message}");
                throw;
            }
        }
    }
}
