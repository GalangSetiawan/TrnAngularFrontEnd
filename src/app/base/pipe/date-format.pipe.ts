import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TimeHelper } from 'src/app/helper/time-helper';

const DATE_FORMAT_ID = {
  'shortDate': 'dd/MM/yyyy',
  'shortDate2': 'dd-MM-yyyy',
  'mediumDate': 'dd MMM yyyy',
  'fullDate': 'dd MMMM yyyy',
  'shortDatetime': 'dd MMM yyyy HH:mm',
  'shortDatetimeSecond': 'dd MMM yyyy HH:mm:ss',
  'shortDatetime2': 'dd/MM/yyyy HH:mm',
  'jexcelFullDate': 'yyyy-MM-dd',
  'time': 'HH:mm',
  'timeWithSecond': 'HH:mm:ss',
  'timeWithoutColon': 'HHmm',
  'yearMonth': 'yyyy/MM',
  'dayOfWeek': 'EEEE'
};

const DATE_FORMAT_EN = {
  'shortDate': 'MM/dd/yyyy',
  'shortDate2': 'MM-dd-yyyy',
  'mediumDate': 'MMM dd yyyy',
  'fullDate': 'MMMM dd yyyy',
  'shortDatetime': 'MMM dd yyyy HH:mm',
  'shortDatetimeSecond': 'MMM dd yyyy HH:mm:ss',
  'shortDatetime2': 'MM/dd/yyyy HH:mm',
  'jexcelFullDate': 'yyyy-MM-dd',
  'time': 'HH:mm',
  'timeWithSecond': 'HH:mm:ss',
  'timeWithoutColon': 'HHmm',
  'yearMonth': 'MM/yyyy',
  'dayOfWeek': 'EEEE'
};

@Pipe({ name: 'dateFormat', pure: true })
export class DateFormatPipe implements PipeTransform {

  private datePipe: DatePipe;

  constructor() {
    this.datePipe = new DatePipe('en-US');
  }

  /*
  public transform(value: Date | string, format: 'shortDate' | 'mediumDate' | 'fullDate' | 'shortDatetime' | any): string {
    try {
      if (value === null) {
        return null;
      }

      if (format === null) {
        format = 'shortDate';
      }

      let dateFormat = DATE_FORMAT_ID[format];
      if (!DATE_FORMAT_ID[format]) {
        dateFormat = format;
      }

      if (value instanceof Date) {
        if (value.getTime() === TimeHelper.getMaxDate().getTime()) {
          return '';
        }
        return this.datePipe.transform(value, dateFormat);
      } else {
        const date = new Date(value);
        // const date = new Date(Number(value.substring(0, 4)), Number(value.substring(5, 7)), Number(value.substring(8, 10)));
        if (date.getTime() === TimeHelper.getMaxDate().getTime()) {
          return '';
        }
        return this.datePipe.transform(date, dateFormat);
      }
    } catch (e) {
      console.error('[Dev Error] Unexpected error when using pipe', e);
      return 'undefined';
    }
  }
  */

  public transform(value: Date | string, format: 'shortDate' | 'mediumDate' | 'fullDate' | 'shortDatetime' | 'yearMonth' | any, locale?: string): string {
    try {
      if (value === null) {
        return null;
      }

      if (format === null) {
        format = 'shortDate';
      }

      let dateFormat = undefined;
      if (locale !== undefined && locale !== null && locale !== '') {
        // saat ini locale hanya bisa : en-US dan id-ID
        if (locale === 'id-ID') {
          if (!DATE_FORMAT_ID[format]) {
            dateFormat = format;
          } else {
            dateFormat = DATE_FORMAT_ID[format];
          }    
        } else {
          if (!DATE_FORMAT_EN[format]) {
            dateFormat = format;
          } else {
            dateFormat = DATE_FORMAT_EN[format];
          }    
        }
      } else {
        if (!DATE_FORMAT_EN[format]) {
          dateFormat = format;
        } else {
          dateFormat = DATE_FORMAT_EN[format];
        }          
      }

      if (value instanceof Date) {
        if (value.getTime() === TimeHelper.getMaxDate().getTime()) {
          return '';
        }
        return this.datePipe.transform(value, dateFormat);
      } else {
        const date = new Date(value);
        // const date = new Date(Number(value.substring(0, 4)), Number(value.substring(5, 7)), Number(value.substring(8, 10)));
        if (date.getTime() === TimeHelper.getMaxDate().getTime()) {
          return '';
        }
        return this.datePipe.transform(date, dateFormat);
      }
    } catch (e) {
      console.error('[Dev Error] Unexpected error when using pipe', e);
      return 'undefined';
    }
  }

}
