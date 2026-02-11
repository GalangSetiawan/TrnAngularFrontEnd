import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAlertComponent } from './app-alert.component';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    TranslateModule,
  ],
  exports: [AppAlertComponent],
  declarations: [
    AppAlertComponent,
  ],
  providers: [AppAlertService, MessageService]
})
export class AlertModule { }
