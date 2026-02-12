import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { PermintaanPembelianDetail } from 'src/app/pg-resource/transaksi/permintaan-pembelian/model/permintaan-pembelian-detail.model';
import { MasterBarang } from 'src/app/pg-resource/master/barang/model/barang.model';
import { MasterBarangService } from 'src/app/pg-resource/master/barang/barang.service';

@Component({
  selector: 'app-input-detil',
  templateUrl: './detil-input.component.html',
  styleUrls: ['./detil-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetilInputComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'DetilBarang';
  public inputForm: FormGroup;
  public selectedData: PermintaanPembelianDetail;
  public mode: string;

  // untuk autocomplete barang
  public filteredBarang: any[];

  // untuk dropdown unit
  public unitOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private appAlertService: AppAlertService,
    private confirmationService: ConfirmationService,
    private uiBlockService: UiBlockService,
    private translateService: TranslateService,
    public defaultLanguageState: DefaultLanguageState,
    private bsModalRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private barangService: MasterBarangService,
    private cdRef: ChangeDetectorRef,
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

    if (this.selectedData.barang && this.selectedData.barang.id) {
      this.populateUnitOptions(this.selectedData.barang);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  private initInputForm() {
    this.inputForm = this.fb.group({
      nourut: [{ value: 0, disabled: true }, Validators.required],
      barang: [{ value: new MasterBarang(), disabled: false }, Validators.required],
      jumlahDiminta: [{ value: 0, disabled: false }, Validators.required],
      unitDiminta: [{ value: '', disabled: false }, Validators.required],
      jumlahUnitStok: [{ value: 0, disabled: true }],
      unitStok: [{ value: '', disabled: true }],
    });
  }

  private patchValue() {
    if (this.selectedData) {
      this.inputForm.patchValue({
        nourut: (this.selectedData.nourut == null ? 0 : this.selectedData.nourut),
        barang: (this.selectedData.barang == null ? new MasterBarang() : this.selectedData.barang),
        jumlahDiminta: (this.selectedData.jumlahDiminta == null ? 0 : this.selectedData.jumlahDiminta),
        unitDiminta: (this.selectedData.unitDiminta == null ? '' : this.selectedData.unitDiminta),
        jumlahUnitStok: (this.selectedData.jumlahUnitStok == null ? 0 : this.selectedData.jumlahUnitStok),
        unitStok: (this.selectedData.unitStok == null ? '' : this.selectedData.unitStok),
      });
    }
  }

  private fillModel() {
    this.selectedData.nourut = this.inputForm.controls.nourut.value;
    this.selectedData.barang = this.inputForm.controls.barang.value;
    this.selectedData.jumlahDiminta = this.inputForm.controls.jumlahDiminta.value;
    this.selectedData.unitDiminta = this.inputForm.controls.unitDiminta.value;
    this.selectedData.jumlahUnitStok = this.inputForm.controls.jumlahUnitStok.value;
    this.selectedData.unitStok = this.inputForm.controls.unitStok.value;
  }

  public doSave() {
    this.uiBlockService.showUiBlock();

    // Buat instance baru untuk add mode
    const newData = new PermintaanPembelianDetail();
    newData.nourut = this.inputForm.controls.nourut.value;
    newData.barang = this.inputForm.controls.barang.value;
    newData.jumlahDiminta = this.inputForm.controls.jumlahDiminta.value;
    newData.unitDiminta = this.inputForm.controls.unitDiminta.value;
    newData.jumlahUnitStok = this.inputForm.controls.jumlahUnitStok.value;
    newData.unitStok = this.inputForm.controls.unitStok.value;

    this.uiBlockService.hideUiBlock();
    this.bsModalRef.close({ selectedData: newData, mode: this.mode });
  }

  public doEdit() {
    this.uiBlockService.showUiBlock();

    this.fillModel();

    this.uiBlockService.hideUiBlock();
    this.bsModalRef.close({ selectedData: this.selectedData, mode: this.mode });
  }

  public Save() {
    if (this.mode === 'add') {
      this.doSave();
    } else {
      this.doEdit();
    }
  }

  public back() {
    this.bsModalRef.close({ selectedData: null, mode: this.mode });
  }

  // AUTOCOMPLETE untuk Barang
  public filterBarang(event) {
    this.uiBlockService.showUiBlock();
    const searchParams = {
      namaBarang: event.query,
      aktif: 'Y',
    };
    const sort: any = {
      namaBarang: 'asc',
    };

    this.barangService
      .search(searchParams, sort)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (result: StdResponse<MasterBarang[]>) => {
          this.filteredBarang = result.data;
          setTimeout(() => {
            this.cdRef.markForCheck();
            this.uiBlockService.hideUiBlock();
          }, 0);
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);
        }
      );
  }

  // Ketika barang dipilih, populate unit options
  public onBarangSelect(event: any) {
    // Explicitly set barang to ensure it's properly stored
    const barang = event;

    if (barang && barang.id) {
      console.log('Barang selected:', barang);
      this.inputForm.controls.barang.patchValue(barang);
      this.populateUnitOptions(barang);

      // Reset unit diminta dan kalkulasi
      this.inputForm.controls.unitDiminta.patchValue('');
      this.inputForm.controls.jumlahUnitStok.patchValue(0);
      this.inputForm.controls.unitStok.patchValue(barang.unitStok);

      // Trigger change detection
      this.cdRef.markForCheck();

      console.log('Unit options populated:', this.unitOptions);
    }
  }

  // Untuk verifikasi inputan di autocomplete barang
  public verifikasiAutocompleteBarang(data: any) {
    let periksa = false;
    if (typeof data === 'string') {
      // ini pasti inputan autocomplete berdasarkan ketikan bukan select dari pilihan
      periksa = true;
    }

    

    if (periksa) {
      this.uiBlockService.showUiBlock();

      this.barangService
        .getByNama(data)
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
          (result: StdResponse<MasterBarang>) => {
            this.uiBlockService.hideUiBlock();

            if (result.data) {
              this.inputForm.controls.barang.patchValue(result.data);
              this.populateUnitOptions(result.data);
            } else {
              this.inputForm.controls.barang.patchValue(new MasterBarang());
              this.unitOptions = [];
            }
          },
          (error) => {
            this.uiBlockService.hideUiBlock();
            this.appAlertService.error(error.errors);
          }
        );
    }
  }

  private populateUnitOptions(barang: MasterBarang) {
    if (barang && barang.id) {
      console.log('Populating unit options for:', {
        unit1: barang.unit1,
        unit2: barang.unit2,
        unitStok: barang.unitStok
      });

      this.unitOptions = [
        { label: barang.unit1, value: barang.unit1 },
        { label: barang.unit2, value: barang.unit2 },
        { label: barang.unitStok, value: barang.unitStok },
      ];

      console.log('Unit options created:', this.unitOptions);
    } else {
      this.unitOptions = [];
    }
  }

  // Ketika jumlah diminta berubah, hitung ulang jumlah unit stok
  public jumlahDimintaChanged() {
    console.log('Jumlah diminta changed');
    this.calculateJumlahUnitStok();
  }

  // Ketika unit diminta berubah, hitung ulang jumlah unit stok
  public unitDimintaChanged() {
    console.log('Unit diminta changed to:', this.inputForm.controls.unitDiminta.value);
    this.calculateJumlahUnitStok();
  }

  // Kalkulasi jumlah unit stok berdasarkan formula konversi
  private calculateJumlahUnitStok() {
    const barang: MasterBarang = this.inputForm.controls.barang.value;
    const jumlahDiminta: number = this.inputForm.controls.jumlahDiminta.value;
    const unitDiminta: string = this.inputForm.controls.unitDiminta.value;

    console.log('Calculating jumlah unit stok with:', {
      barang: barang?.namaBarang,
      jumlahDiminta,
      unitDiminta,
      konversi1: barang?.konversiUnit1KeUnit2,
      konversi2: barang?.konversiUnit2KeStok
    });

    if (!barang || !barang.id || !jumlahDiminta || !unitDiminta) {
      console.log('Calculation skipped - missing required data');
      this.inputForm.controls.jumlahUnitStok.patchValue(0);
      return;
    }

    let jumlahUnitStok = 0;

    if (unitDiminta === barang.unit1) {
      // unit1 → unitStok: jumlah × konversi1 × konversi2
      jumlahUnitStok = jumlahDiminta * barang.konversiUnit1KeUnit2 * barang.konversiUnit2KeStok;
      console.log(`Formula unit1: ${jumlahDiminta} × ${barang.konversiUnit1KeUnit2} × ${barang.konversiUnit2KeStok} = ${jumlahUnitStok}`);
    } else if (unitDiminta === barang.unit2) {
      // unit2 → unitStok: jumlah × konversi2
      jumlahUnitStok = jumlahDiminta * barang.konversiUnit2KeStok;
      console.log(`Formula unit2: ${jumlahDiminta} × ${barang.konversiUnit2KeStok} = ${jumlahUnitStok}`);
    } else if (unitDiminta === barang.unitStok) {
      // unitStok → unitStok: jumlah × 1
      jumlahUnitStok = jumlahDiminta;
      console.log(`Formula unitStok: ${jumlahDiminta} × 1 = ${jumlahUnitStok}`);
    }

    console.log('Setting jumlahUnitStok to:', jumlahUnitStok);
    this.inputForm.controls.jumlahUnitStok.patchValue(jumlahUnitStok);
    this.inputForm.controls.unitStok.patchValue(barang.unitStok);
  }
}
