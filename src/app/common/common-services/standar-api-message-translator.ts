import { DatePipe } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import * as _ from 'lodash';
import { StdErrorResponse, StdMessage, StdMultiMessage, StdResponse } from '../common-model/standar-api-response.model';


@Injectable()
export class StdMessageTranslator {

  private regexIsoDate = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
  private datePipe: DatePipe;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.datePipe = new DatePipe(locale);
  }

  public translateApiResponse(stdResponse: StdResponse<any>, domainMessages: Object): void {

    if (stdResponse.notices) { stdResponse.feNotices = this.translateMessages(stdResponse.notices, domainMessages); }
    if (stdResponse.warnings) { stdResponse.feWarnings = this.translateMessages(stdResponse.warnings, domainMessages); }
    if (stdResponse.errors) { stdResponse.feErrors = this.translateMessages(stdResponse.errors, domainMessages); }
    if (stdResponse.multiErrors) {stdResponse.feMultiErrors = this.translateMultiMessage(stdResponse.multiErrors, domainMessages); }
  }

  public translateErrorResponse(daError: StdErrorResponse, domainMessages: Object): void {
    if (daError.errors) { daError.feErrors = this.translateMessages(daError.errors, domainMessages); }
  }

  private translateMessages(daMessages: StdMessage[], domainMessages: Object): string[] {
    const modMessages: string[] = [];
    for (const message of daMessages) { modMessages.push(this.translateMessage(message, domainMessages)); }
    return modMessages;
  }

  private translateMultiMessage(daMultiMessage: StdMultiMessage[], domainMessages: object): string[][] {
    const modMessages: string[][] = [];
    daMultiMessage.forEach((daMessages) => {
      for (const messages of daMessages.messages) {
        modMessages.push(this.translateMessages(messages, domainMessages));
      }
    });
    return modMessages;
  }
  
  public translateLooseMessage(m: StdMessage, domainMessages: any): string {
    return this.translateMessage(m, domainMessages.contents);
  }

  private translateMessage(daMessage: StdMessage, domainMessages: Object): string {

    let feDesc = domainMessages[daMessage.code];
    if (!feDesc) { feDesc = DaBaseMessages.messages[daMessage.code]; }

    if (feDesc) { feDesc = this.combineMessageAndArgs(feDesc, daMessage.args); }
    else { feDesc = daMessage.code + ': ' + daMessage.desc; }

    return feDesc;
  }

  private combineMessageAndArgs(message: string, args: any[]) {
    let result = message;

    if (!_.isEmpty(args)) {
      for (let i = 0; i < args.length; i++) {

        let arg = args[i];
        if (String(arg).match(this.regexIsoDate)) {
          const date = new Date(arg);
          if (String(arg).length >= 10) { arg = this.datePipe.transform(date, 'dd/MM/yyyy'); }
          else if (String(arg).length > 4) { arg = this.datePipe.transform(date, 'MMMM y'); }
        }

        result = result.split('{{' + i.toString() + '}}').join(arg);
      }
    }

    return result;
  }
}

class DaBaseMessages {
  public static readonly messages = {
    '': 'undefined or missing code.',
    'data.require.id.and.version': 'Id and version of data is required for this action.',
    'data.require.id.version.and.root.version': 'Id, version, and rootVersion of data is required for this action.',
    'data.not.found': 'Data "{0}" with id "{1}" not found.',
    'root.data.not.found': 'Root data "{0}" with id "{1}" not found.',
    'data.obsolete.version': 'Cannot modify data due to incorrect version.',
    'root.data.obsolete.version': 'Cannot modify data due to incorrect root version.',
    'root.version.required': 'RootVersion required!',
    'CORE.HTTP400.001': 'Http media type "{0}" is not supported.',
    'CORE.JDBC.001': 'Could not connect to database, please contact administrator. Log number: {0}.',
    'delete.data.integrity.violation': 'Delete failed! Data is still being referenced to another entity(s)',
    'image.file.invalid': 'Only [jpg|jpeg|png|gif] image`s extension is allowed!',

    'invalid.format.yearmonth': 'Invalid format for yearMonth!',
    'invalid.format.yyyymmdd': 'Invalid format for date!',
    'invalid.format.datetime': 'Invalid argument for date time!',

    'upload.sheet.not.found': 'Sheet "Upload" not found within file, please re-download the template!',
    'upload.column.not.found': 'Column "{0}" not found within file, please re-download the template!',
    'upload.header.invalid': 'Invalid header(s), please re-download the template!',
    'invalid.number': 'Invalid number value "{0}".',
    'upload.error': 'Upload file error at row "{0}".',
    'upload.success': '{0} rows uploaded!',
    'upload.data.empty': 'Column "{0}" must not be empty!',

    'file.excel.unknown': 'Unrecognized excel file!',
    'file.creation.error': 'Error when creating file "{0}", please retry or contact the administrator.',
    'file.excel.extension.unrecognized': 'Excel file extension unrecognized! Currently supported is ".xls"',
    'file.extension.required': 'File extension required!',
    'file.template.not.found': 'File "{0}" not found at "{1}"',
    'file.upload.not.found': 'Uploaded file not found or is deleted, please re-upload.',
    'file.jrxml.empty.name': 'JRXML filename required!',
    'file.generated.empty.name': 'Default generated filename required!',
    'jasper.compile.template.error': 'Cannot compile template "{0}"!',
    'jasper.fill.report.error': 'Cannot fill report with data!',
    'jasper.generate.report.error': 'Cannot generate report!',
    'IO.error': 'Unknown I/O error! Please retry or contact the administrator.',

    'email.address.invalid': 'Email recipient invalid or cannot be found!',
    'email.send.fail': 'Email cannot be sent due to an error! Please retry or contact the administrator.',
    'email.authorization.fail': 'Email server authorization failed! Please retry or contact the administrator.',
  };

}
