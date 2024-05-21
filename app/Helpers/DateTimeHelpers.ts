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

  public static addDays(dates: any, days: any) {
    const originalDateTime = new Date(dates);
    const newDateTime = new Date(
      originalDateTime.getTime() + days * 60 * 24 * 60000
    );
    const formattedNewDateTime = `${newDateTime.getFullYear()}-${String(
      newDateTime.getMonth() + 1
    ).padStart(2, "0")}-${String(newDateTime.getDate()).padStart(
      2,
      "0"
    )} ${String(newDateTime.getHours()).padStart(2, "0")}:${String(
      newDateTime.getMinutes()
    ).padStart(2, "0")}:${String(newDateTime.getSeconds()).padStart(2, "0")}`;
    if (days == 0) {
      const datas = formattedNewDateTime.split(" ")[0];
      return datas + " 00:00:00";
    }
    return formattedNewDateTime;
  }

  public static formatDate(date: any, isHour: boolean = false) {
    const dateObj = new Date(date);

    if (isHour) {
      const options: any = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const dateLisible = dateObj.toLocaleDateString("fr-FR", options);

      return dateLisible;
    } else {
      const options: any = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const dateLisible = dateObj.toLocaleDateString("fr-FR", options);

      return dateLisible;
    }
  }
  public static FormatDate(date: any) {
    const newdate = new Date(date);
    const readableDate = newdate.toLocaleString();
    return readableDate.split(" ")[0];
  }
}

export default DateTimeHelpers;
