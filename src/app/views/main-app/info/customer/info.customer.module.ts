import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { DynamicDialogModule } from 'primeng/dynamicdialog';


import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CustomerService } from 'src/app/pg-resource/master/customer/customer.service';
import { InfoCustomerComponent } from './info.customer.component';


@NgModule({
  declarations: [
    InfoCustomerComponent,
  ],  entryComponents: [
  ],  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AccordionModule,
    TableModule,
    TranslateModule,
    CardModule,
    DynamicDialogModule,
    ButtonModule,
    InputTextModule,
  ],
  exports: [
    InfoCustomerComponent,
  ],
  providers: [
    CustomerService,
  ]})
export class InfoCustomerModule { }