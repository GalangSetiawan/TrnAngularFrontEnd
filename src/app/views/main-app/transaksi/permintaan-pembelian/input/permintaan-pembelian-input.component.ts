import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationService } from 'primeng/api';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { DialogService } from 'primeng';
import { ResizedEvent } from 'angular-resize-event';
import { SessionHelper } from 'src/app/helper/session-helper';
import { LZStringService } from 'ng-lz-string';
import { BreadCrumbService } from 'src/app/common/common-components/breadcrumb/breadcrumb.service';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { PermintaanPembelianHeader } from 'src/app/pg-resource/transaksi/permintaan-pembelian/model/permintaan-pembelian-header.model';
import { PermintaanPembelianDetail } from 'src/app/pg-resource/transaksi/permintaan-pembelian/model/permintaan-pembelian-detail.model';
import { PermintaanPembelianComplete } from 'src/app/pg-resource/transaksi/permintaan-pembelian/model/permintaan-pembelian-complete.model';
import { PermintaanPembelianService } from 'src/app/pg-resource/transaksi/permintaan-pembelian/permintaan-pembelian.service';
import { MasterBagian } from 'src/app/pg-resource/master/bagian/model/bagian.model';
import { MasterBagianService } from 'src/app/pg-resource/master/bagian/bagian.service';

@Component({
  selector: 'app-permintaan-pembelian-input',
  templateUrl: './permintaan-pembelian-input.component.html',
  styleUrls: ['./permintaan-pembelian-input.component.scss'],
  providers: [DialogService],
  encapsulation: ViewEncapsulation.None
})
export class PermintaanPembelianInputComponent implements OnInit, OnDestroy, AfterViewChecked {

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'PermintaanPembelian';
  public inputForm: FormGroup;
  public mode: string;
  public selectedData: PermintaanPembelianHeader = null;

  // datatables untuk detail
  public dataTablesDetail: PermintaanPembelianDetail[] = [];
  public isLoadingResultsDataTablesDetail = false;
  public totalRecordsDataTablesDetail = 0;

  // width dari dataTables (untuk resize)
  public dataTablesWidth = '0px';

  // untuk data tables yang punya error message per row
  public expandedRowsDataTablesDetail: {} = {};

  // untuk enable/disable button-button
  public isViewOnly = false;

  // url asal yang membuka layar ini
  public previousUrl = '';

  // tabbed
  public tabIndex = 0;

  // terkait autocomplete untuk master bagian
  public filteredBagian: any[];

  constructor(
    private fb: FormBuilder,
    private appAlertService: AppAlertService,
    private confirmationService: ConfirmationService,
    private uiBlockService: UiBlockService,
    private translateService: TranslateService,
    private permintaanPembelianService: PermintaanPembelianService,
    private route: ActivatedRoute,
    private router: Router,
    private lzStringService: LZStringService,
    private breadCrumbService: BreadCrumbService,
    public defaultLanguageState: DefaultLanguageState,
    private cdRef: ChangeDetectorRef,
    private bagianService: MasterBagianService,
  ) {
  }

  public ngOnInit() {
    this.breadCrumbService.sendReloadInfo('reload');
    this.initInputForm();
    this.dataBridging();

    // Handle locale change untuk calendar
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      const tempTanggal = this.inputForm.controls.tanggal.value;
      this.inputForm.controls.tanggal.patchValue(null);
      this.cdRef.detectChanges();
      this.inputForm.controls.tanggal.patchValue(new Date(tempTanggal));
    });
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
      nomor: [{ value: '', disabled: this.isViewOnly }],
      bagian: [{ value: new MasterBagian(), disabled: this.isViewOnly }, Validators.required],
      tanggal: [{ value: new Date(), disabled: this.isViewOnly }, Validators.required],
      keterangan: [{ value: '', disabled: this.isViewOnly }],
    });
  }

  private patchValue() {
    if (this.selectedData) {
      this.inputForm.patchValue({
        nomor: (this.selectedData.nomor === null ? '' : this.selectedData.nomor),
        tanggal: (this.selectedData.tanggal === null ? '' : new Date(this.selectedData.tanggal)),
        bagian: (this.selectedData.bagian === null ? new MasterBagian() : this.selectedData.bagian),
        keterangan: (this.selectedData.keterangan === null ? '' : this.selectedData.keterangan),
      });
    }
  }

  public doGet(data: PermintaanPembelianHeader) {
    this.uiBlockService.showUiBlock();

    this.permintaanPembelianService.get(data)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        (result) => {

          this.uiBlockService.hideUiBlock();
          // set ke mode edit, dan set data dari hasil balikan
          this.mode = 'edit';
          const sessionData = {
            data: result.data,
            mode: 'edit',
            prevTabName: '',
            prevTab: 0,
            tableFirst: 0,
            tableNumberOfRows: 0
          };
          SessionHelper.setItem('TPERMINTAAN-H', sessionData, this.lzStringService);

          this.selectedData = sessionData.data.header;

          this.dataTablesDetail = [];
          this.dataTablesDetail = result.data.details;
          this.isLoadingResultsDataTablesDetail = false;
          this.totalRecordsDataTablesDetail = this.dataTablesDetail.length;

          // memberi keyIn untuk keperluan input di grid DAN untuk expandable rows error message
          this.dataTablesDetail.map(item => {
            item.keyIn = uuidv4();
          });

          this.patchValue();

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

  private fillModel() {
    this.selectedData.nomor = this.inputForm.controls.nomor.value;
    this.selectedData.tanggal = this.inputForm.controls.tanggal.value;
    this.selectedData.bagian = this.inputForm.controls.bagian.value;
    this.selectedData.keterangan = this.inputForm.controls.keterangan.value;
  }

  private bentukDataUntukDisimpan(): PermintaanPembelianComplete {

    this.fillModel();

    // bersihkan data yang baru diinput tapi dihapus oleh user (isDeleted = true dan id nya kosong)
    for (let i = this.dataTablesDetail.length - 1; i >= 0; i--) {
      if (this.dataTablesDetail[i].isSelect && this.dataTablesDetail[i].id === null) {
        this.dataTablesDetail.splice(i, 1);
      }
    }

    const transaksiKomplit = new PermintaanPembelianComplete();
    transaksiKomplit.header = this.selectedData;
    transaksiKomplit.details = this.dataTablesDetail;

    return transaksiKomplit;
  }

  public doSaveSave() {
    this.uiBlockService.showUiBlock();

    const transaksiKomplit = this.bentukDataUntukDisimpan();

    this.permintaanPembelianService
      .add(transaksiKomplit).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.uiBlockService.hideUiBlock();
          this.translateService.get('TambahBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            }
            );

          this.doGet(result.header);

        },
        (error) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);

          // tambahan untuk handle error di grid
          const result = this.permintaanPembelianService.convertResponseComplete(error);

          if (result.data) {

            this.permintaanPembelianService.translateInGridError(result.data);

            this.dataTablesDetail = result.data.details;
            if (this.dataTablesDetail === undefined) {
              this.dataTablesDetail = [];
            }
            this.dataTablesDetail.slice();

            const transaksi = new PermintaanPembelianComplete();
            transaksi.header = this.selectedData;
            transaksi.details = this.dataTablesDetail;

            const sessionDataHeader = SessionHelper.getItem('TPERMINTAAN-H', this.lzStringService);
            sessionDataHeader.data = transaksi;
            SessionHelper.setItem('TPERMINTAAN-H', sessionDataHeader, this.lzStringService);

            // agar secara default semua expandable row terbuka
            const thisRef = this;

            this.dataTablesDetail.forEach((item) => {
              thisRef.expandedRowsDataTablesDetail[item.keyIn] = true;
            });
            this.expandedRowsDataTablesDetail = Object.assign({}, this.expandedRowsDataTablesDetail);

          }
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  public doEditSave() {
    this.uiBlockService.showUiBlock();

    const transaksiKomplit = this.bentukDataUntukDisimpan();

    this.permintaanPembelianService
      .edit(transaksiKomplit).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.uiBlockService.hideUiBlock();
          this.translateService.get('EditBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            }
            );

          this.doGet(result.header);

        },
        (error) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);

          // tambahan untuk handle error di grid
          const result = this.permintaanPembelianService.convertResponseComplete(error);

          if (result.data) {

            this.permintaanPembelianService.translateInGridError(result.data);

            this.dataTablesDetail = result.data.details;
            if (this.dataTablesDetail === undefined) {
              this.dataTablesDetail = [];
            }
            this.dataTablesDetail.slice();

            const transaksi = new PermintaanPembelianComplete();
            transaksi.header = this.selectedData;
            transaksi.details = this.dataTablesDetail;

            const sessionDataHeader = SessionHelper.getItem('TPERMINTAAN-H', this.lzStringService);
            sessionDataHeader.data = transaksi;
            SessionHelper.setItem('TPERMINTAAN-H', sessionDataHeader, this.lzStringService);

            // agar secara default semua expandable row terbuka
            const thisRef = this;
            this.dataTablesDetail.forEach((item) => {
              thisRef.expandedRowsDataTablesDetail[item.keyIn] = true;
            });
            this.expandedRowsDataTablesDetail = Object.assign({}, this.expandedRowsDataTablesDetail);

          }
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  public Save() {
    if (this.mode === 'add') {
      this.doSaveSave();
    } else {
      this.doEditSave();
    }
  }

  private doDeleteDelete() {
    this.uiBlockService.showUiBlock();
    this.permintaanPembelianService.delete(this.selectedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.inputForm.reset();
          this.uiBlockService.hideUiBlock();

          this.translateService.get('HapusBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            }
            );

          // Bersihkan session storage dan ubah ke mode add
          const dataKomplit = new PermintaanPembelianComplete();
          dataKomplit.header.tanggal = new Date();

          const sessionData = SessionHelper.getItem('TPERMINTAAN-H', this.lzStringService);
          sessionData.data = dataKomplit;
          sessionData.mode = 'add';

          SessionHelper.setItem('TPERMINTAAN-H', sessionData, this.lzStringService);

          this.mode = 'add';

          this.inputForm.controls.nomor.enable();

          this.selectedData = dataKomplit.header;
          this.dataTablesDetail = [];
          this.dataTablesDetail.slice();

          this.isLoadingResultsDataTablesDetail = false;

          this.totalRecordsDataTablesDetail = this.dataTablesDetail.length;

          this.patchValue();
        },
        (error: any) => {
          this.isLoadingResultsDataTablesDetail = false;
          this.appAlertService.error(error.errors);
        },
        () => { 
          this.isLoadingResultsDataTablesDetail = false;
          this.uiBlockService.hideUiBlock(); 
        }
      );
  }

  public delete() {
    this.translateService.get('HapusTransaksiNomor')
      .subscribe((translation) => {

        this.confirmationService.confirm({
          message: translation + ' ' + this.inputForm.controls.nomor.value + ' ?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.doDeleteDelete();
          },
          reject: () => {
          }
        });

      }
      );
  }

  // Dipanggil saat terjadi resize terhadap div yang menampung data table
  onDivDataTableResized(event: ResizedEvent) {
    const width = event.newWidth - 90;
    this.dataTablesWidth = width + 'px';
  }

  public back() {

    if (this.previousUrl === '/transaksi/permintaan-pembelian') {
      const sessionData = SessionHelper.getItem('TPERMINTAAN-BROWSE-SCR', this.lzStringService);

      // agar layar sebelumnya tahu bahwa ada aksi kembali dari detail
      sessionData.fromDetail = true;
      SessionHelper.setItem('TPERMINTAAN-BROWSE-SCR', sessionData, this.lzStringService);

      this.router.navigate([this.previousUrl]);
    } else {
      this.router.navigate([this.previousUrl]);
    }
  }

  private dataBridging() {

    const sessionData = SessionHelper.getItem('TPERMINTAAN-H', this.lzStringService);
    this.previousUrl = sessionData.urlAsal;

    if (sessionData.mode === 'edit') {
      this.selectedData = sessionData.data.header;
      this.dataTablesDetail = sessionData.data.details;

      this.isLoadingResultsDataTablesDetail = false;

      this.mode = 'edit';
      this.initInputForm();

    } else {
      this.selectedData = sessionData.data.header;
      this.dataTablesDetail = sessionData.data.details;

      this.isLoadingResultsDataTablesDetail = false;

      this.mode = 'add';

    }

    this.totalRecordsDataTablesDetail = this.dataTablesDetail.length;

    // memberi keyIn untuk keperluan input di grid DAN untuk expandable rows error message
    this.dataTablesDetail.map(item => {
      item.keyIn = uuidv4();
    });

    this.patchValue();

    if (sessionData.prevTabName === 'tabIndex') {
      if (sessionData.prevTab !== undefined && sessionData.prevTab > 0) {
        this.tabIndex = sessionData.prevTab - 1;
      }
    }

  }

  // AUTOCOMPLETE untuk Bagian
  public filterBagian(event) {

    this.uiBlockService.showUiBlock();
    const searchParams = {
      namaBagian: event.query,
      aktif: 'Y',
    };
    const sort: any = {
      namaBagian: 'asc',
    };

    this.bagianService
      .search(searchParams, sort)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (result: StdResponse<MasterBagian[]>) => {
          this.filteredBagian = result.data;
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

  // Untuk verifikasi inputan di autocomplete bagian
  public verifikasiAutocompleteBagian(data: any) {

    let periksa = false;
    if (typeof data === 'string') {
      // ini pasti inputan autocomplete berdasarkan ketikan bukan select dari pilihan
      periksa = true;
    }
    

    if (periksa) {
      this.uiBlockService.showUiBlock();

      this.bagianService
        .getByNama(data)
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
          (result: StdResponse<MasterBagian>) => {
            this.uiBlockService.hideUiBlock();

            if (result.data) {
              this.inputForm.controls.bagian.patchValue(result.data);
            } else {
              this.inputForm.controls.bagian.patchValue(new MasterBagian());
            }

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
  }

  public detailChanged() {
    // Called when detail table emits change event
    // Can add calculations or other logic here
  }

}
