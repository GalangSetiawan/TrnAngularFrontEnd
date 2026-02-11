import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject} from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Location } from '@angular/common';

import { ConfirmationService } from 'primeng/api';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { InvoiceDetailLainLain } from 'src/app/pg-resource/transaksi/invoice/model/invoice-detail-lainlain.model';

@Component({
  selector: 'app-input-detil-lain-lain',
  templateUrl: './detil-lain-lain-input.component.html',
  encapsulation : ViewEncapsulation.None
})

export class DetilLainLainInputComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'DetilLainLain';

  public inputForm: FormGroup;

  public selectedData: InvoiceDetailLainLain;
  public mode: string;

  public filteredTraining: any[];

  constructor(
    private fb: FormBuilder,
    private appAlertService: AppAlertService,
    private confirmationService: ConfirmationService,
    private uiBlockService: UiBlockService,
    private translateService: TranslateService,
    public defaultLanguageState: DefaultLanguageState,
    private bsModalRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.translateService.get(this.title)
      .subscribe((translation) => {
        this.title = translation;
        this.config.header = this.title;
      }
    );

  }

  public ngOnInit() {
    this.selectedData = this.config.data.selectedData;
    this.mode = this.config.data.mode;
    this.initInputForm();
    this.patchValue();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  private initInputForm() {
    this.inputForm = this.fb.group({
      nourut: [{value: 0, disabled: true}, Validators.required],
      harga: [{value: 0, disabled: false}],
      pctdisc: [{value: 0, disabled: false}],
      nilpctdisc: [{value: 0, disabled: true}],
      nildisc: [{value: 0, disabled: false}],
      netto: [{value: 0, disabled: true}],
      keterangan: [{value: '', disabled: false}],
    });
  }

  private patchValue() {
    if (this.selectedData) {
      this.inputForm.patchValue({
        nourut: (this.selectedData.nourut == null ? '0' : this.selectedData.nourut),
        keterangan: (this.selectedData.keterangan == null ? '' : this.selectedData.keterangan),
        harga: (this.selectedData.harga == null ? 0 : this.selectedData.harga),
        pctdisc: (this.selectedData.pctdisc == null ? 0 : this.selectedData.pctdisc),
        nilpctdisc: (this.selectedData.nilpctdisc == null ? 0 : this.selectedData.nilpctdisc),
        nildisc: (this.selectedData.nildisc == null ? 0 : this.selectedData.nildisc),
        netto: (this.selectedData.netto == null ? 0 : this.selectedData.netto),
      });
    }
  }

  private fillModel() {
    this.selectedData.nourut = this.inputForm.controls.nourut.value;
    this.selectedData.harga = this.inputForm.controls.harga.value;
    this.selectedData.pctdisc = this.inputForm.controls.pctdisc.value;
    this.selectedData.nilpctdisc = this.inputForm.controls.nilpctdisc.value;
    this.selectedData.nildisc = this.inputForm.controls.nildisc.value;
    this.selectedData.netto = this.inputForm.controls.netto.value;
    this.selectedData.keterangan = this.inputForm.controls.keterangan.value;
  }

  public doSave() {
    this.uiBlockService.showUiBlock();

    this.selectedData = new InvoiceDetailLainLain();
    
    this.fillModel();

    this.uiBlockService.hideUiBlock();
    this.bsModalRef.close({selectedData: this.selectedData, mode: this.mode});
  }

  public doEdit() {
    this.uiBlockService.showUiBlock();

    this.fillModel();

    this.uiBlockService.hideUiBlock();
    this.bsModalRef.close({selectedData: this.selectedData, mode: this.mode});
  }

  public Save1() {
    if (this.mode === 'add') {
      this.doSave();
    } else {
      this.doEdit();
    }
  }

  public backBack1() {
    this.bsModalRef.close({selectedData: null, mode: this.mode});
  }

  public hitungNetto(){
    this.inputForm.controls.netto.patchValue(
      this.inputForm.controls.harga.value -
      this.inputForm.controls.nilpctdisc.value -
      this.inputForm.controls.nildisc.value
    );
  }

  public pctdiscChanged(){
    this.inputForm.controls.nilpctdisc.patchValue(
      (Math.floor(this.inputForm.controls.pctdisc.value * this.inputForm.controls.harga.value) / 100)
    );
    this.hitungNetto();
  }

  public nildiscChanged(){
    this.hitungNetto();
  }

  public hargaChanged(){
    this.inputForm.controls.nilpctdisc.patchValue(
      (Math.floor(this.inputForm.controls.pctdisc.value * this.inputForm.controls.harga.value) / 100)
    );
    this.hitungNetto();
  }
}
