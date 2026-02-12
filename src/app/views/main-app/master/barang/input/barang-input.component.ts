import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { BreadCrumbService } from 'src/app/common/common-components/breadcrumb/breadcrumb.service';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { FEComboConstantService } from 'src/app/common/common-services/fe.combo.constants.service';
import { SessionHelper } from 'src/app/helper/session-helper';
import { LZStringService } from 'ng-lz-string';

import { MasterBarang } from 'src/app/pg-resource/master/barang/model/barang.model';
import { MasterBarangService } from 'src/app/pg-resource/master/barang/barang.service';

@Component({
  selector: 'app-barang-input',
  templateUrl: './barang-input.component.html',
  styleUrls: ['./barang-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BarangInputComponent implements OnInit, OnDestroy, AfterViewChecked {

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'MasterBarangInput';
  public inputForm: FormGroup;

  public radioButtonAktif: any[];

  public mode: string; // add, edit, view
  public selectedData: MasterBarang = null;
  public isViewOnly = false;
  public previousUrl = '';

  constructor(
    private fb: FormBuilder,
    private appAlertService: AppAlertService,
    private confirmationService: ConfirmationService,
    private uiBlockService: UiBlockService,
    private translateService: TranslateService,
    private barangService: MasterBarangService,
    private route: ActivatedRoute,
    private router: Router,
    private breadCrumbService: BreadCrumbService,
    public defaultLanguageState: DefaultLanguageState,
    private cdRef: ChangeDetectorRef,
    private feComboConstantService: FEComboConstantService,
    private lzStringService: LZStringService
  ) {}

  public ngOnInit() {
    this.breadCrumbService.sendReloadInfo('reload');
    this.initInputForm();
    this.initRadioButtonAktif();
    this.dataBridging();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  private initInputForm() {
    this.inputForm = this.fb.group({
      kodeBarang: [{ value: '', disabled: this.isViewOnly }, Validators.required],
      namaBarang: [{ value: '', disabled: this.isViewOnly }, Validators.required],
      unit1: [{ value: '', disabled: this.isViewOnly }, Validators.required],
      konversiUnit1KeUnit2: [{ value: 0, disabled: this.isViewOnly }, [Validators.required, Validators.min(0.0001)]],
      unit2: [{ value: '', disabled: this.isViewOnly }, Validators.required],
      konversiUnit2KeStok: [{ value: 0, disabled: this.isViewOnly }, [Validators.required, Validators.min(0.0001)]],
      unitStok: [{ value: '', disabled: this.isViewOnly }, Validators.required],
      aktif: [{ value: '', disabled: this.isViewOnly }]
    });
  }

  public initRadioButtonAktif() {
    this.uiBlockService.showUiBlock();
    this.feComboConstantService
      .getAktifNonAktif()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.uiBlockService.hideUiBlock();

          this.radioButtonAktif = result.data.map(
            item => new Object({ name: item.deskripsi, key: item.kode })
          );

          this.inputForm.controls.aktif.patchValue(this.radioButtonAktif[0].key);
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  private dataBridging() {
    const sessionData = SessionHelper.getItem('MBARANG-H', this.lzStringService);
    this.previousUrl = sessionData.urlAsal;

    if (sessionData.mode === 'edit' || sessionData.mode === 'view') {
      this.selectedData = sessionData.data;
      this.mode = sessionData.mode;
      this.isViewOnly = this.mode === 'view';
      this.initInputForm();
      this.patchValue();

      if (this.mode === 'edit') {
        this.inputForm.controls.kodeBarang.disable();
      }
    } else {
      this.selectedData = sessionData.data;
      this.mode = 'add';
      this.isViewOnly = false;
      this.initInputForm();
    }
  }

  private patchValue() {
    if (this.selectedData) {
      this.inputForm.patchValue({
        kodeBarang: (this.selectedData.kodeBarang === null ? '' : this.selectedData.kodeBarang),
        namaBarang: (this.selectedData.namaBarang === null ? '' : this.selectedData.namaBarang),
        unit1: (this.selectedData.unit1 === null ? '' : this.selectedData.unit1),
        konversiUnit1KeUnit2: (this.selectedData.konversiUnit1KeUnit2 === null ? 0 : this.selectedData.konversiUnit1KeUnit2),
        unit2: (this.selectedData.unit2 === null ? '' : this.selectedData.unit2),
        konversiUnit2KeStok: (this.selectedData.konversiUnit2KeStok === null ? 0 : this.selectedData.konversiUnit2KeStok),
        unitStok: (this.selectedData.unitStok === null ? '' : this.selectedData.unitStok),
        aktif: (this.selectedData.aktif === null ? '' : this.selectedData.aktif)
      });
    }
  }

  private fillModel() {
    this.selectedData.kodeBarang = this.inputForm.controls.kodeBarang.value;
    this.selectedData.namaBarang = this.inputForm.controls.namaBarang.value;
    this.selectedData.unit1 = this.inputForm.controls.unit1.value;
    this.selectedData.konversiUnit1KeUnit2 = this.inputForm.controls.konversiUnit1KeUnit2.value;
    this.selectedData.unit2 = this.inputForm.controls.unit2.value;
    this.selectedData.konversiUnit2KeStok = this.inputForm.controls.konversiUnit2KeStok.value;
    this.selectedData.unitStok = this.inputForm.controls.unitStok.value;
    this.selectedData.aktif = this.inputForm.controls.aktif.value;
  }

  public Save() {
    if (this.mode === 'add') {
      this.doSaveSave();
    } else {
      this.doEditSave();
    }
  }

  public doSaveSave() {
    this.uiBlockService.showUiBlock();

    this.fillModel();

    this.barangService
      .add(this.selectedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.uiBlockService.hideUiBlock();

          this.translateService.get('TambahBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            });

          this.back();
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  public doEditSave() {
    this.uiBlockService.showUiBlock();

    this.fillModel();

    this.barangService
      .edit(this.selectedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.uiBlockService.hideUiBlock();

          this.translateService.get('EditBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            });

          this.back();
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  public back() {
    if (this.previousUrl === '/master/barang') {
      const sessionData = SessionHelper.getItem('MBARANG-BROWSE-SCR', this.lzStringService);
      sessionData.fromDetail = true;
      SessionHelper.setItem('MBARANG-BROWSE-SCR', sessionData, this.lzStringService);
    }
    this.router.navigate([this.previousUrl]);
  }
}
