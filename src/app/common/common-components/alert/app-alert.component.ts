import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { Subscription } from 'rxjs';

import { AppAlertMessage, AppAlertSeverity } from 'src/app/common/common-components/alert/app-alert.model';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { MessageService, Message } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-alert',
  templateUrl: 'app-alert.component.html',
})
export class AppAlertComponent implements OnDestroy {

  public messages: Message[] = [];
  public severity: string;
  public isAlertClosed: boolean;

  private subs: Subscription;

  constructor(
    private appAlertService: AppAlertService,
    private messageService: MessageService,
    private translateService: TranslateService,
  ) {

    this.subs = this.appAlertService.getAlertObs().pipe().subscribe(
      (message: AppAlertMessage) => {
        if (message) {
          this.show(message);
        } else {
          this.hide();
        }
      }
    );
  }

  public ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private hide() {
    this.messages = [];
    this.isAlertClosed = true;
  }

  private show(alertMessage: AppAlertMessage) {
    if (alertMessage.message) {

        this.severity = this.getSeverity(alertMessage.severity);

        if (alertMessage.message instanceof Array) {
            const messages = alertMessage.message;

            messages.forEach(message => {
            this.translateService.get(message.code, message.args).subscribe(
                (translatedMessage) => {
                this.messages.push({severity: this.severity, summary: '', detail: translatedMessage as string});
                }
            );
            });
            this.messageService.addAll(this.messages);
        } else {
            if (alertMessage.message.code !== '*') {
                const message = alertMessage.message;
                this.translateService.get(message.code, message.args).subscribe(
                (translatedMessage) => {
                    this.messages.push({severity: this.severity, summary: '', detail: translatedMessage as string});
                }
                );
                this.messageService.addAll(this.messages);

            } else {
                const descOfMessage = alertMessage.message.desc as unknown;
                if (descOfMessage instanceof Array) {
                  for (const desc of descOfMessage) {
                    this.messages.push({severity: this.severity, summary: '', detail: desc});
                  }
                } else {
                  this.messages.push({severity: this.severity, summary: '', detail: descOfMessage as string});
                }
                this.messageService.addAll(this.messages);
            }
          }
      }

  }

  private getSeverity(severity: AppAlertSeverity): string {
    if (severity === AppAlertSeverity.Info) {
      return 'info';
    } else if (severity === AppAlertSeverity.Warning) {
      return 'warning';
    } else if (severity === AppAlertSeverity.Error) {
      return 'error';
    }
  }

  public email() {
    /**
     * TODO : Do logic send email here!
     */
    this.hide();
  }
}
