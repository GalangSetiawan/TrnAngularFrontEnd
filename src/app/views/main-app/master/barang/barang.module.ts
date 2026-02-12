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
import {ToolbarModule} from 'primeng/toolbar';


import { FEComboConstantService } from 'src/app/common/common-services/fe.combo.constants.service';
import { GlComboConstantService } from 'src/app/pg-resource/constants/combo.constants.service';
import { PipeModule } from 'src/app/base/pipe/pipe.module';
import { ComboConstantsService } from 'src/app/pg-resource/master/common/combo-constants/combo.constants.service';

import { MasterBarangService } from 'src/app/pg-resource/master/barang/barang.service';
import { BarangBrowseComponent } from './browse/barang-browse.component';
import { BarangInputComponent } from './input/barang-input.component';
import { BarangRoutingModule } from './barang.routing';

@NgModule({
  declarations: [
    BarangBrowseComponent,
    BarangInputComponent,
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
    BarangRoutingModule,
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
    ToolbarModule
  ],
  exports: [
    BarangInputComponent,
  ],
  providers: [
    GlComboConstantService,
    FEComboConstantService,
    MasterBarangService,
    ComboConstantsService,
    DialogService,
  ]
})
export class BarangModule { }
