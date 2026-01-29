using System;
using NodaTime;
using NodaTime.Text;

class DateHandler {
    // Function to parse a date string into a LocalDate object
    public static LocalDate ParseDate(string dateString, string format = "yyyy-MM-dd") {
        var pattern = LocalDatePattern.CreateWithInvariantCulture(format);
        var parseResult = pattern.Parse(dateString);
        if (parseResult.Success) {
            return parseResult.Value;
        } else {
            throw new FormatException("Invalid date format");
        }
    }

    // Function to format a LocalDate object into a string
    public static string FormatDate(LocalDate date, string format = "yyyy-MM-dd") {
        var pattern = LocalDatePattern.CreateWithInvariantCulture(format);
        return pattern.Format(date);
    }

    // Function to convert LocalDate to DateTime in a specific timezone
    public static DateTime ConvertToDateTime(LocalDate date, string timeZoneId) {
        var timeZone = DateTimeZoneProviders.Tzdb[timeZoneId];
        var localDateTime = date.AtMidnight();
        var zonedDateTime = localDateTime.InZoneLeniently(timeZone);
        return zonedDateTime.ToDateTimeUnspecified();
    }
}
class Program {
    static void Main(string[] args) {
        // Example usage
        string dateString = "2023-10-05";
        LocalDate date = DateHandler.ParseDate(dateString);
        Console.WriteLine("Parsed Date: " + date);

        string formattedDate = DateHandler.FormatDate(date, "MMMM dd, yyyy");
        Console.WriteLine("Formatted Date: " + formattedDate);

        DateTime dateTimeInZone = DateHandler.ConvertToDateTime(date, "America/New_York");
        Console.WriteLine("DateTime in New York: " + dateTimeInZone);
    }
}