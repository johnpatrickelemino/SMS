using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using YourProject.Services;

namespace YourProject.Controllers
{
    [ApiController]
    [Route("api/email")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp(
            string email,
            string otp)
        {
            await _emailService.SendOtpAsync(email, otp);
            return Ok("OTP email sent successfully");
        }

        [HttpPost("send-enrollment")]
        public async Task<IActionResult> SendEnrollment(
            string email,
            string firstName,
            string lastName,
            string enrollmentDate)
        {
            await _emailService.SendEnrollmentAsync(
                email,
                firstName,
                lastName,
                enrollmentDate
            );

            return Ok("Enrollment email sent");
        }
    }
}
