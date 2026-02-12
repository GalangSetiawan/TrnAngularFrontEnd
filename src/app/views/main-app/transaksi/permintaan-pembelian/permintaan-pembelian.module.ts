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
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { FEComboConstantService } from 'src/app/common/common-services/fe.combo.constants.service';
import { GlComboConstantService } from 'src/app/pg-resource/constants/combo.constants.service';
import { PipeModule } from 'src/app/base/pipe/pipe.module';
import { TranslateMessageService } from 'src/app/common/common-services/translate.message.service';
import { ComboConstantsService } from 'src/app/pg-resource/master/common/combo-constants/combo.constants.service';


import { PermintaanPembelianRoutingModule } from './permintaan-pembelian.routing';
import { PermintaanPembelianService } from 'src/app/pg-resource/transaksi/permintaan-pembelian/permintaan-pembelian.service';
import { PermintaanPembelianBrowseComponent } from './browse/permintaan-pembelian-browse.component';
import { PermintaanPembelianInputComponent } from './input/permintaan-pembelian-input.component';
import { TabelDetilComponent } from './input/tabel-detil/tabel-detil.component';
import { DetilInputComponent } from './input/tabel-detil/input-detil/detil-input.component';

// Master services untuk dropdown
import { MasterBagianService } from 'src/app/pg-resource/master/bagian/bagian.service';
import { MasterBarangService } from 'src/app/pg-resource/master/barang/barang.service';

@NgModule({
  declarations: [
    PermintaanPembelianBrowseComponent,
    PermintaanPembelianInputComponent,
    TabelDetilComponent,
    DetilInputComponent,
  ],
  entryComponents: [
    DetilInputComponent, // Untuk dialog
  ],
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
    PermintaanPembelianRoutingModule,
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
    ConfirmDialogModule
  ],
  exports: [
    PermintaanPembelianInputComponent,
  ],
  providers: [
    TranslateMessageService,
    MasterBagianService,
    MasterBarangService,
    GlComboConstantService,
    FEComboConstantService,
    ComboConstantsService,
    PermintaanPembelianService,
    DialogService,
  ]
})
export class PermintaanPembelianModule { }
