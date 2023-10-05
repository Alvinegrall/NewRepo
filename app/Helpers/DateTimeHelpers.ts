import { DateTime } from "luxon";

class DateTimeHelpers {
  public date: DateTime;

  constructor(date: DateTime) {
    this.date = date;
  }

  public static now() {
    const newDate = DateTime.now();

    return newDate.toISODate() + " " + newDate.toISOTime()?.split(".")[0];
  }

  public static addMinutes(dates: any, minutes: any) {
    const originalDateTime = new Date(dates);
    const newDateTime = new Date(originalDateTime.getTime() + minutes * 60000);
    const formattedNewDateTime = `${newDateTime.getFullYear()}-${String(
      newDateTime.getMonth() + 1
    ).padStart(2, "0")}-${String(newDateTime.getDate()).padStart(
      2,
      "0"
    )} ${String(newDateTime.getHours()).padStart(2, "0")}:${String(
      newDateTime.getMinutes()
    ).padStart(2, "0")}:${String(newDateTime.getSeconds()).padStart(2, "0")}`;

    return formattedNewDateTime;
  }
  public static addMonth(dates: any, months: any) {
    const originalDateTime = new Date(dates);
    const newDateTime = new Date(
      originalDateTime.setMonth(originalDateTime.getMonth() + months)
    );

    const formattedNewDateTime = `${newDateTime.getFullYear()}-${String(
      newDateTime.getMonth() + 1
    ).padStart(2, "0")}-${String(newDateTime.getDate()).padStart(
      2,
      "0"
    )} ${String(newDateTime.getHours()).padStart(2, "0")}:${String(
      newDateTime.getMinutes()
    ).padStart(2, "0")}:${String(newDateTime.getSeconds()).padStart(2, "0")}`;

    return formattedNewDateTime;
  }
}

export default DateTimeHelpers;
