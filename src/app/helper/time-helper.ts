import { ObjectHelper } from './object-helper';

export class TimeHelper {
  public static getSystemDate() {
    return new Date();
  }

  public static getMaxDate() {
    return new Date(9999, 11, 31);
  }

  public static getPreviousFirstDateOfMonth(date: Date) {

    return date.setMonth(date.getMonth() - 1);
    
  }

  public static getLastDateOfMonth(year: number, month: number) {
    /* for month: 1 - 12, 1 means january, 12 means december */
    if (month === null || year === null) {
      return null;
    }
    return new Date(year, month, 0);
  }

  public static fromDate(date: Date, time?: string) {
    if (date === null) {
      return null;
    }

    if (date != null && ObjectHelper.isEmpty(time)) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } else if (date != null && !ObjectHelper.isEmpty(time)) {
      if (time.length < 4 || time.length > 6) {
        throw new Error('invalid value!');
      }

      if (time.length === 4) {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          Number(time.substring(0, 2)),
          Number(time.substring(2, 4))
        );
      } else {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          Number(time.substring(0, 2)),
          Number(time.substring(2, 4)),
          Number(time.substring(4, 6))
        );
      }
    }
  }

  public static fromDateTime(dateTime: Date) {
    if (dateTime === null) {
      return null;
    }

    return new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      dateTime.getHours(),
      dateTime.getMinutes(),
      dateTime.getSeconds(),
      dateTime.getMilliseconds()
    );
  }

  public static getTime(dateTime: Date, isUsingSeconds?: boolean): string {
    if (dateTime === null) {
      return null;
    }
    if (isUsingSeconds) {
      return (
        (dateTime.getHours() < 10
          ? '0' + dateTime.getHours()
          : dateTime.getHours()) +
        '' +
        (dateTime.getMinutes() < 10
          ? '0' + dateTime.getMinutes()
          : dateTime.getMinutes()) +
        '' +
        (dateTime.getSeconds() < 10
          ? '0' + dateTime.getSeconds()
          : dateTime.getSeconds())
      );
    } else {
      return (
        (dateTime.getHours() < 10
          ? '0' + dateTime.getHours()
          : dateTime.getHours()) +
        '' +
        (dateTime.getMinutes() < 10
          ? '0' + dateTime.getMinutes()
          : dateTime.getMinutes())
      );
    }
  }

  public static isDateEquals(date1: Date, date2: Date) {
    if (date1 === null && date2 === null) {
      return true;
    } else if (date1 !== null && date2 === null) {
      return false;
    } else if (date1 === null && date2 !== null) {
      return false;
    }

    return date1.getTime() == date2.getTime();
  }

  public static isDateBefore(startDate: Date, endDate: Date) {
    if (startDate === null || endDate === null) {
      return false;
    }

    return startDate.getTime() - endDate.getTime() < 0 ? true : false;
  }

  public static isDateBeforeEqual(startDate: Date, endDate: Date) {
    if (startDate === null || endDate === null) {
      return false;
    }

    return startDate.getTime() - endDate.getTime() <= 0 ? true : false;
  }

  public static isOverlap(startDate: Date, endDate: Date, compStart: Date, compEnd: Date) {

    let result = false;

    if (startDate && endDate) {
      if (compStart && compEnd) {
        if (this.isDateAfterEqual(startDate, compStart) && this.isDateBeforeEqual(startDate, compEnd)) {
          result = true;
        } else if (this.isDateBeforeEqual(startDate, compStart) && this.isDateAfterEqual(endDate, compStart)) {
          result = true;
        }
      } else if (compStart && !compEnd) {
        if (this.isDateAfterEqual(startDate, compStart)) {
          result = true;
        }
      }
    }
    return result;
  }

  public static isDateAfterEqual(startDate: Date, endDate: Date) {
    if (startDate === null || endDate === null) {
      return false;
    }

    return startDate.getTime() - endDate.getTime() >= 0 ? true : false;
  }

  public static isDateTimeBefore(
    startDate: Date,
    startTime: string,
    endDate: Date,
    endTime: string
  ) {
    if (
      startDate === null ||
      endDate === null ||
      ObjectHelper.isEmpty(startTime) ||
      ObjectHelper.isEmpty(endTime)
    ) {
      return false;
    }

    if (this.isDateBefore(endDate, startDate)) {
      if (Number(startTime) < Number(endTime)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (Number(startTime) > Number(endTime)) {
        return false;
      } else {
        return true;
      }
    }
  }

  public static isMax31Days(start: Date, end: Date) {
    if (start === null || end === null) {
      return false;
    }

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(
      Math.abs((start.getTime() - end.getTime()) / oneDay)
    );

    return diffDays < 31 ? true : false;
  }

  public static substractDays(date: Date, numberOfDays: number): Date {
    const numberOfDaysInSecond = 24 * 60 * 60 * 1000 * numberOfDays;
    date.setTime(date.getTime() - numberOfDaysInSecond);
    return date;
  }

  public static addDays(date: Date, numberOfDays: number): Date {
    const numberOfDaysInSecond = 24 * 60 * 60 * 1000 * numberOfDays;
    date.setTime(date.getTime() + numberOfDaysInSecond);
    return date;
  }

  public static isTimeBefore(startTime: string, endTime: string) {
    if (ObjectHelper.isEmpty(startTime) || ObjectHelper.isEmpty(endTime)) {
      return false;
    }

    if (Number(startTime) < Number(endTime)) {
      return true;
    } else {
      return false;
    }
  }

  public static getHourDifference(date1: Date, date2: Date) {
    return Math.abs(date1.getTime() - date2.getTime()) / 36e5;
  }

  public static getYearMonth(param: Date): string {
    if (ObjectHelper.isEmpty(param)) {
      return '';
    }

    const date = new Date(param);
    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    if (month.length === 1) {
      month = '0' + month;
    }

    return year + month;
  }

  public static getMonth(param: Date): number {
    if (ObjectHelper.isEmpty(param)) {
      return 0;
    }

    const date = new Date(param);

    return date.getMonth() + 1;
  }

  public static addMonths(date:Date, months:number): Date {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    //return date;
    return this.substractDays(date, 1);

  }

  public static convertMinuteToHour(minutesInput: number) {
    if (minutesInput === null) {
      return null;
    }

    const hours = (minutesInput / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);

    return {
      hours: rhours,
      minutes: rminutes
    }

  }

  public static getDayNameFromDate(param: Date) {
    if (ObjectHelper.isEmpty(param)) {
      return null;
    }

    const date = new Date(param);
    const weekday = new Array(7);
    weekday[0] = 'Minggu';
    weekday[1] = 'Senin';
    weekday[2] = 'Selasa';
    weekday[3] = 'Rabu';
    weekday[4] = 'Kamis';
    weekday[5] = 'Jumat';
    weekday[6] = 'Sabtu';

    return weekday[date.getDay()];
  }

  // generate date dari parameter string yyyymmdd, misal : 20201229
  public static getDateFromStringYYYYMMDD(yyyymmdd: string) {

    const strTahun   = yyyymmdd.substring(0,4); // tahun
    const strBulan   = yyyymmdd.substring(4,6); // bulan
    const strTanggal = yyyymmdd.substring(6,8); // tanggal

    let tahun = 1945;
    let bulan = 0;
    let tanggal = 1;

    if(!isNaN(Number(strTahun))){
      tahun = Number(strTahun);
    }

    if(!isNaN(Number(strBulan))){
      bulan = Number(strBulan) - 1; // karena bulan di javascript basisnya 0-based
    }

    if(!isNaN(Number(strTanggal))){
      tanggal = Number(strTanggal);
    }

    return new Date(tahun, bulan, tanggal);
  }

  public static getStringYYYYMMDDFromDate(date: Date) {
    let tahun = date.getFullYear().toString();

    let bulan = '000' + (date.getMonth() + 1).toString();
    bulan = bulan.substr(bulan.length - 2, bulan.length);
    
    let hari = '000' + date.getDate().toString();
    hari = hari.substr(hari.length - 2, hari.length);
 
    return tahun+bulan+hari;
  }
}
