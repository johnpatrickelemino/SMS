var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
builder.Services.AddScoped<EmailService>();

var app = builder.Build();

app.UseCors("AllowReact");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Enrollment endpoint
app.MapPost("/api/enrollment", async (EnrollmentRequest request, EmailService emailService) =>
{
    try
    {
        // Validate request
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.FirstName) || string.IsNullOrEmpty(request.LastName))
        {
            return Results.BadRequest(new { success = false, message = "Email, FirstName, and LastName are required" });
        }

        var enrollmentDate = new EnrollmentDate(request.StudentId);
        
        // Send enrollment confirmation email
        await emailService.SendEnrollmentConfirmationAsync(
            request.Email,
            request.FirstName,
            request.LastName,
            enrollmentDate.GetFormattedDate()
        );

        var response = new
        {
            success = true,
            message = "Enrollment date set successfully",
            studentId = request.StudentId,
            enrollmentDate = enrollmentDate.GetFormattedDate(),
            enrollmentDateTime = enrollmentDate.GetEnrollmentDate()
        };
        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { success = false, message = ex.Message });
    }
})
.WithName("SetEnrollmentDate")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public class EnrollmentRequest
{
    public string? StudentId { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}

public class EnrollmentDate
{
    public string? StudentId { get; set; }
    public DateTime EnrollmentDateTime { get; set; }

    public EnrollmentDate()
    {
        EnrollmentDateTime = DateTime.Now;
    }

    public EnrollmentDate(string? studentId)
    {
        StudentId = studentId;
        EnrollmentDateTime = DateTime.Now;
    }

    public string GetFormattedDate()
    {
        return EnrollmentDateTime.ToString("yyyy-MM-dd HH:mm:ss");
    }

    public DateTime GetEnrollmentDate()
    {
        return EnrollmentDateTime;
    }
}

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEnrollmentConfirmationAsync(string email, string firstName, string lastName, string enrollmentDate)
    {
        try
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"];
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
            var senderEmail = emailSettings["SenderEmail"];
            var senderPassword = emailSettings["SenderPassword"];
            var senderName = emailSettings["SenderName"] ?? "Student Management System";

            if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
            {
                Console.WriteLine("Email settings not configured. Skipping email send.");
                return;
            }

            using (var client = new System.Net.Mail.SmtpClient(smtpServer, smtpPort))
            {
                client.EnableSsl = true;
                client.Credentials = new System.Net.NetworkCredential(senderEmail, senderPassword);

                var mailMessage = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress(senderEmail, senderName),
                    Subject = "Enrollment Confirmation",
                    Body = GetEmailBody(firstName, lastName, enrollmentDate),
                    IsBodyHtml = true
                };

                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);
                Console.WriteLine($"Enrollment confirmation email sent to {email}");
            }
        }
        catch (Exception ex)
        {
            // Log the error but don't throw - enrollment should succeed even if email fails
            Console.WriteLine($"Email sending failed: {ex.Message}");
        }
    }

    private string GetEmailBody(string firstName, string lastName, string enrollmentDate)
    {
        return $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Welcome to Student Management System!</h2>
                <p>Dear {firstName} {lastName},</p>
                
                <p>We are pleased to confirm that you have successfully enrolled in our system.</p>
                
                <div style='background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <p><strong>Enrollment Date:</strong> {enrollmentDate}</p>
                </div>
                
                <p>You can now access all course materials and resources on your student dashboard. If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <p>Best regards,<br/>
                Student Management System Team</p>
            </body>
            </html>";
    }
}
