import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';

import { AppAlertSeverity, AppAlertMessage } from './app-alert.model';
import { StdMessage } from '../../common-model/standar-api-response.model';

@Injectable()
export class AppAlertService implements OnDestroy {

  private alertSource = new ReplaySubject<AppAlertMessage>(1);
  private alert$ = this.alertSource.asObservable();

  constructor() {
  }

  public ngOnDestroy() {
    this.alertSource.complete();
  }

  public getAlertObs(): Observable<AppAlertMessage> {
    return this.alert$;
  }

  public info(message: StdMessage, details?: any): void {
    this.alertSource.next(null);
    this.alertSource.next(new AppAlertMessage(message, details, AppAlertSeverity.Info));
  }

  public instantInfo(message: string, details?: any): void {
    this.alertSource.next(null);
    this.alertSource.next(new AppAlertMessage({code: '*', desc: message}, details, AppAlertSeverity.Info));
  }

  public error(message: StdMessage, details?: any): void {
    this.alertSource.next(null);
    this.alertSource.next(new AppAlertMessage(message, details, AppAlertSeverity.Error));
  }

  public instantError(message: string, details?: any): void {
    this.alertSource.next(null);
    this.alertSource.next(new AppAlertMessage({code: '*', desc: message}, details, AppAlertSeverity.Error));
  }

  public warn(message: StdMessage, details?: any): void {
    this.alertSource.next(null);
    this.alertSource.next(new AppAlertMessage(message, details, AppAlertSeverity.Warning));
  }

  public instantWarn(message: string, details?: any): void {
    this.alertSource.next(null);
    this.alertSource.next(new AppAlertMessage({code: '*', desc: message}, details, AppAlertSeverity.Warning));
  }
}
