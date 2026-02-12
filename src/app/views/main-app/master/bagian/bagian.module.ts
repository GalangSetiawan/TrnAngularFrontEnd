import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  AutoCompleteModule,
  CalendarModule,
  CardModule,
  CheckboxModule,
  DialogService,
  DropdownModule,
  FieldsetModule,
  InputNumberModule,
  InputTextareaModule,
  RadioButtonModule,
  TabViewModule
} from 'primeng';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CarouselModule } from 'primeng/carousel';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { FEComboConstantService } from 'src/app/common/common-services/fe.combo.constants.service';
import { GlComboConstantService } from 'src/app/pg-resource/constants/combo.constants.service';
import { PipeModule } from 'src/app/base/pipe/pipe.module';
import { ComboConstantsService } from 'src/app/pg-resource/master/common/combo-constants/combo.constants.service';

import { MasterBagianService } from 'src/app/pg-resource/master/bagian/bagian.service';
import { BagianBrowseComponent } from './browse/bagian-browse.component';
import { BagianInputComponent } from './input/bagian-input.component';
import { BagianRoutingModule } from './bagian.routing';


@NgModule({
  declarations: [
    BagianBrowseComponent,
    BagianInputComponent,
  ],
  entryComponents: [],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AccordionModule,
    TableModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    BagianRoutingModule,
    RadioButtonModule,
    TabViewModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    InputTextareaModule,
    CardModule,
    AutoCompleteModule,
    AngularResizedEventModule,
    TooltipModule,
    SplitButtonModule,
    CarouselModule,
    PipeModule,
    FieldsetModule,
    SelectButtonModule,
    ConfirmDialogModule,
  ],
  exports: [
    BagianInputComponent,
  ],
  providers: [
    GlComboConstantService,
    FEComboConstantService,
    MasterBagianService,
    ComboConstantsService,
    DialogService,
  ]
})
export class BagianModule { }
