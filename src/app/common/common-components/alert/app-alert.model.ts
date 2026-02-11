import { StdMessage } from '../../common-model/standar-api-response.model';

export enum AppAlertSeverity {
  Info,
  Error,
  Warning
}

export class AppAlertMessage {
  constructor(public message: StdMessage, public details: any, public severity: AppAlertSeverity) {}
}
