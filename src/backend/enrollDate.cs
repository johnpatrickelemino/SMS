using System;

public class EnrollmentDate
{
    public string StudentId { get; set; }
    public DateTime EnrollmentDateTime { get; set; }

    public EnrollmentDate()
    {
        EnrollmentDateTime = DateTime.Now;
    }

    public EnrollmentDate(string studentId)
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