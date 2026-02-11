import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnChanges, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject} from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';

import { ConfirmationService } from 'primeng/api';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';

import { DialogService, DynamicDialogRef, SplitButton } from 'primeng';
import { ResizedEvent } from 'angular-resize-event';
import { SessionHelper } from 'src/app/helper/session-helper';
import { LZStringService } from 'ng-lz-string';
import { DomSanitizer } from '@angular/platform-browser';
import { BreadCrumbService } from 'src/app/common/common-components/breadcrumb/breadcrumb.service';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { TranslateMessageService } from 'src/app/common/common-services/translate.message.service';
import { FEComboConstantService } from 'src/app/common/common-services/fe.combo.constants.service';
import { ComboConstants } from 'src/app/pg-resource/master/common/combo-constants/model/combo.constants.model';
import { ComboConstantsService } from 'src/app/pg-resource/master/common/combo-constants/combo.constants.service';
import { InvoiceHeader } from 'src/app/pg-resource/transaksi/invoice/model/invoice-header.model';
import { InvoiceDetailLainLain } from 'src/app/pg-resource/transaksi/invoice/model/invoice-detail-lainlain.model';
import { InvoiceManualService } from 'src/app/pg-resource/transaksi/invoice/invoice-manual.service';
import { InvoiceManualComplete } from 'src/app/pg-resource/transaksi/invoice/model/invoice-manual-complete.model';
import { CustomerService } from 'src/app/pg-resource/master/customer/customer.service';
import { Customer } from 'src/app/pg-resource/master/customer/model/customer.model';
import { InfoCustomerComponent } from '../../../info/customer/info.customer.component';

@Component({
  selector: 'app-invoice-manual-input',
  templateUrl: './invoice-manual-input.component.html',
  styleUrls: ['./invoice-manual-input.component.scss'],
  providers: [DialogService],
  encapsulation : ViewEncapsulation.None
})

export class InvoiceManualInputComponent implements OnInit, OnDestroy, AfterViewChecked {

  bsModalInfoCustomer: DynamicDialogRef;

  public tab1Index = 0;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'InvoiceManual';

  public inputForm: FormGroup;

  public mode: string;

  public selectedData: InvoiceHeader = null;

  // datatables untuk detil lain-lain
  public dataTablesLainLain: InvoiceDetailLainLain[] = [];
  public isLoadingResultsDataTablesLainLain = false;
  public totalRecordsDataTablesLainLain = 0;

  // width dari dataTables (untuk kemudian di set di bawah (di onDivDataTableResized) secara dinamis)
  public dataTablesWidth = '0px';

  // untuk data tables yang punya error message per row
  public expandedRowsDataTablesLainLain: {} = {};

  // untuk enable/disable button-button
  public isViewOnly = false;

  // url asal yang membuka layar ini
  public previousUrl = '';

  public radioButtonDeposit: any[];
  comboStatus: object[];

  // tabbed
  public tabIndex = 0;
  public tab2Title = 'LainLain';

  // terkait autocomplete
  public filteredCustomer: any[];

  constructor(
    private fb: FormBuilder,
    private appAlertService: AppAlertService,
    private confirmationService: ConfirmationService,
    private uiBlockService: UiBlockService,
    private translateService: TranslateService,
    private invoiceManualService: InvoiceManualService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private lzStringService: LZStringService,
    private domSanitizer: DomSanitizer,
    private breadCrumbService: BreadCrumbService,
    public defaultLanguageState: DefaultLanguageState,
    private cdRef: ChangeDetectorRef,
    private translateMessageService: TranslateMessageService,
    private feComboConstantService: FEComboConstantService,
    private comboConstantsService: ComboConstantsService,
    private customerService: CustomerService,
  ) {
  }

  public ngOnInit() {
    this.breadCrumbService.sendReloadInfo('reload');
    this.initInputForm();
    this.initRadioButtonDeposit();
    this.initComboStatus();
    this.dataBridging();

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {

      const tempTgtrn = this.inputForm.controls.tgtrn.value;
      this.inputForm.controls.tgtrn.patchValue(null);
      this.cdRef.detectChanges();
      this.inputForm.controls.tgtrn.patchValue(new Date(tempTgtrn));

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
      nomor: [{value: '', disabled: this.isViewOnly}],
      customer: [{value: new Customer(), disabled: this.isViewOnly}, Validators.required],
      tgtrn: [{value: new Date(), disabled: this.isViewOnly}, Validators.required],
      nmcust: [{value: '', disabled: this.isViewOnly}],
      nama: [{value: '', disabled: this.isViewOnly}],
      alamat: [{value: '', disabled: this.isViewOnly}],
      email: [{value: '', disabled: this.isViewOnly}],
      status: [{value: 'NOSENT', disabled: this.isViewOnly}],
      bruto: [{value: 0, disabled: true}],
      totdisc: [{value: 0, disabled: true}],
      dpp: [{value: 0, disabled: true}],
      ppn: [{value: 0, disabled: true}],
      netto: [{value: 0, disabled: true}],
      fltodep: [{value: '', disabled: this.isViewOnly}],
      nildep: [{value: 0, disabled: true}],
      depused: [{value: 0, disabled: false}],
      tgjtemp: [{value: new Date(), disabled: this.isViewOnly}, Validators.required],
      jumbul: [{value: 0, disabled: true}],
      jumsiklus: [{value: 0, disabled: true}],
      satsiklus: [{value: '', disabled: true}],
      pctdis: [{value: 0, disabled: this.isViewOnly}],
      nildis: [{value: 0, disabled: this.isViewOnly}],
      ketdis: [{value: '', disabled: this.isViewOnly}],
    });
  }

  public initRadioButtonDeposit() {

    this.uiBlockService.showUiBlock();
    this.feComboConstantService
    .getYaTidak()
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe(
      (result) => {
        this.uiBlockService.hideUiBlock();

        this.radioButtonDeposit = result.data.map(
            item => new Object({name: item.deskripsi, key: item.kode })
          );

        this.inputForm.controls.fltodep.patchValue(this.radioButtonDeposit[0].key);  

      },
      (error) => {
        this.uiBlockService.hideUiBlock();
      },
      () => {
        this.uiBlockService.hideUiBlock();
      }
    );
  }

  private initComboStatus() {
    this.uiBlockService.showUiBlock();

    const searchParams = {
      rectyp: 'INVSTAT',
    };
    const sort: any = {
      rectxt: 'asc',
    };

    this.comboConstantsService
      .search(searchParams, sort)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .toPromise()
      .then(
        (result: StdResponse<ComboConstants[]>) => {
          this.uiBlockService.hideUiBlock();

          this.comboStatus = result.data.map(
            item => new Object({label: item.rectxt, value: item.reccode })
          );
  
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
        },
      );
  }

  private patchValue() {
    if (this.selectedData) {
      this.inputForm.patchValue({
        nomor: (this.selectedData.nomor === null ? '' : this.selectedData.nomor),
        tgtrn: (this.selectedData.tgtrn === null ? '' : new Date(this.selectedData.tgtrn)),
        customer: (this.selectedData.customer === null ? new Customer() : this.selectedData.customer),
        nmcust: (this.selectedData.nmcust === null ? '' : this.selectedData.nmcust),
        nama: (this.selectedData.nama === null ? '' : this.selectedData.nama),
        alamat: (this.selectedData.alamat === null ? '' : this.selectedData.alamat),
        email: (this.selectedData.email === null ? '' : this.selectedData.email),
        status: (this.selectedData.status === null ? '' : this.selectedData.status),
        bruto: (this.selectedData.bruto === null ? '' : this.selectedData.bruto),
        totdisc: (this.selectedData.totdisc === null ? '' : this.selectedData.totdisc),
        dpp: (this.selectedData.dpp === null ? '' : this.selectedData.dpp),
        ppn: (this.selectedData.ppn === null ? '' : this.selectedData.ppn),
        netto: (this.selectedData.netto === null ? '' : this.selectedData.netto),
        depused: (this.selectedData.depused === null ? '' : this.selectedData.depused),
        fltodep: (this.selectedData.fltodep ? 'Y' : 'T'),
        nildep: (this.selectedData.nildep === null ? '' : this.selectedData.nildep),
        tgjtemp: (this.selectedData.tgjtemp === null ? '' : new Date(this.selectedData.tgjtemp)),
        pctdis: (this.selectedData.pctdis === null ? '' : this.selectedData.pctdis),
        nildis: (this.selectedData.nildis === null ? '' : this.selectedData.nildis),
        ketdis: (this.selectedData.ketdis === null ? '' : this.selectedData.ketdis),
      });

      if (this.inputForm.controls.fltodep.value === 'Y') {
        this.inputForm.controls.depused.disable();
      } else {
        this.inputForm.controls.depused.enable();
      }
  
    }
  }

  public doGet(data: InvoiceHeader) {
    this.uiBlockService.showUiBlock();

    this.invoiceManualService.get(data)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (result) => {

        // set ke mode edit, dan set data dari hasil balikan
        this.mode = 'edit';
        const sessionData = { data: result.data, mode: 'edit', prevTabName: '', prevTab: 0, tableFirst: 0, tableNumberOfRows: 0 };
        SessionHelper.setItem('TINVMANUAL-H', sessionData, this.lzStringService);

        this.selectedData = sessionData.data.header;

        this.dataTablesLainLain = [];
        this.dataTablesLainLain = result.data.detailLainLain;
        this.isLoadingResultsDataTablesLainLain = false;
        this.totalRecordsDataTablesLainLain = this.dataTablesLainLain.length;

        // memberi keyIn untuk keperluan input di grid DAN untuk expandable rows error message pada data tables
        this.dataTablesLainLain.map(item => {
          item.keyIn = uuidv4(); 
        });

        // ambil untuk tampilan unit pengali deposit beserta satuan siklus nya
        let nildep = 0;
        let jumbul = 1;
        let jumsiklus = 1;
        let satsiklus = '';
        this.inputForm.controls.nildep.patchValue(nildep);
        this.inputForm.controls.jumbul.patchValue(jumbul);
        this.inputForm.controls.jumsiklus.patchValue(jumsiklus);
        this.inputForm.controls.satsiklus.patchValue(satsiklus);

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
    this.selectedData.tgtrn = this.inputForm.controls.tgtrn.value;
    this.selectedData.customer = this.inputForm.controls.customer.value;
    this.selectedData.nmcust = this.inputForm.controls.nmcust.value;
    this.selectedData.nama = this.inputForm.controls.nama.value;
    this.selectedData.alamat = this.inputForm.controls.alamat.value;
    this.selectedData.email = this.inputForm.controls.email.value;
    this.selectedData.status = this.inputForm.controls.status.value;
    this.selectedData.bruto = this.inputForm.controls.bruto.value;
    this.selectedData.totdisc = this.inputForm.controls.totdisc.value;
    this.selectedData.dpp = this.inputForm.controls.dpp.value;
    this.selectedData.ppn = this.inputForm.controls.ppn.value;
    this.selectedData.netto = this.inputForm.controls.netto.value;
    this.selectedData.depused = this.inputForm.controls.depused.value;
    this.selectedData.tgjtemp = this.inputForm.controls.tgjtemp.value;
    this.selectedData.pctdis = this.inputForm.controls.pctdis.value;
    this.selectedData.nildis = this.inputForm.controls.nildis.value;
    this.selectedData.ketdis = this.inputForm.controls.ketdis.value;

    if (this.inputForm.controls.fltodep.value === 'Y') {
      this.selectedData.fltodep = true;
    } else {
      this.selectedData.fltodep = false;
    }

    this.selectedData.nildep = this.inputForm.controls.nildep.value;
  }

  private bentukDataUntukDisimpan(): InvoiceManualComplete {

    this.fillModel();

    // bersihkan data yang baru diinput tapi dihapus oleh user (isDeleted = true dan id nya kosong)
    // detail jurnal
    for(let i = this.dataTablesLainLain.length -1; i >= 0 ; i--){
      if(this.dataTablesLainLain[i].isSelect && this.dataTablesLainLain[i].id === null){
        this.dataTablesLainLain.splice(i, 1);
      }
    }

    const transaksiKomplit = new InvoiceManualComplete();
    transaksiKomplit.header = this.selectedData;
    transaksiKomplit.detailLainLain = this.dataTablesLainLain;

    return transaksiKomplit;
  }

  public doSaveSave() {
    this.uiBlockService.showUiBlock();

    const transaksiKomplit = this.bentukDataUntukDisimpan(); 

    this.invoiceManualService
    .add(transaksiKomplit).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      (result) => {
        // this.uiBlockService.hideUiBlock();

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

        // tambahan
        const result = this.invoiceManualService.convertResponseInvoiceManualComplete(error);

        if (result.data) {

          this.invoiceManualService.translateInGridError(result.data);

          this.dataTablesLainLain = result.data.detailLainLain;
          if (this.dataTablesLainLain === undefined) {
            this.dataTablesLainLain = [];
          }
          this.dataTablesLainLain.slice();
          
          const transaksi = new InvoiceManualComplete();
          transaksi.header = this.selectedData;
          transaksi.detailLainLain = this.dataTablesLainLain;
  
          const sessionDataHeader = SessionHelper.getItem('TINVMANUAL-H', this.lzStringService);
          sessionDataHeader.data = transaksi;
          SessionHelper.setItem('TINVMANUAL-H', sessionDataHeader, this.lzStringService);
  
          // agar secara default semua expandable row terbuka
          const thisRef = this;
  
          this.dataTablesLainLain.forEach((item) => {
            thisRef.expandedRowsDataTablesLainLain[item.keyIn] = true;
          });
          this.expandedRowsDataTablesLainLain = Object.assign({}, this.expandedRowsDataTablesLainLain);
  
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

    this.invoiceManualService
    .edit(transaksiKomplit).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      (result) => {
        // this.uiBlockService.hideUiBlock();

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

        // tambahan
        const result = this.invoiceManualService.convertResponseInvoiceManualComplete(error);

        if (result.data) {

          this.invoiceManualService.translateInGridError(result.data);

          this.dataTablesLainLain = result.data.detailLainLain;
          if (this.dataTablesLainLain === undefined) {
            this.dataTablesLainLain = [];
          }
          this.dataTablesLainLain.slice();
  
          const transaksi = new InvoiceManualComplete();
          transaksi.header = this.selectedData;
          transaksi.detailLainLain = this.dataTablesLainLain;
  
          const sessionDataHeader = SessionHelper.getItem('TINVMANUAL-H', this.lzStringService);
          sessionDataHeader.data = transaksi;
          SessionHelper.setItem('TINVMANUAL-H', sessionDataHeader, this.lzStringService);
  
          // agar secara default semua expandable row terbuka
          const thisRef = this;
          this.dataTablesLainLain.forEach((item) => {
            thisRef.expandedRowsDataTablesLainLain[item.keyIn] = true;
          });
          this.expandedRowsDataTablesLainLain = Object.assign({}, this.expandedRowsDataTablesLainLain);
  
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
    this.invoiceManualService.delete(this.selectedData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.inputForm.reset();

          // this.uiBlockService.hideUiBlock();
          this.translateService.get('HapusBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            }
          );

          // Bersihkan session storage dan ubah ke mode add
          const dataKomplit = new InvoiceManualComplete();
          dataKomplit.header.status = 'NOSENT';
          dataKomplit.header.fltodep = false;
          dataKomplit.header.tgtrn = new Date();
    
          // harus nya ambil dulu data dari session lalu di edit yg perlu supaya url asalnya ga ilang
          const sessionData = SessionHelper.getItem('TINVMANUAL-H', this.lzStringService);
          sessionData.data = dataKomplit;
          sessionData.mode = 'add';
  
          // const sessionData = { data: dataKomplit, mode: 'add', prevTabName: '', prevTab: 0, tableFirst: 0, tableNumberOfRows: 0 };
          SessionHelper.setItem('TINVMANUAL-H', sessionData, this.lzStringService);
      
          this.mode = 'add';

          this.inputForm.controls.nomor.enable();
          // this.inputForm.controls.tgtrn.patchValue(new Date());

          this.selectedData = dataKomplit.header;
          this.dataTablesLainLain = [];
          this.dataTablesLainLain.slice();

          this.isLoadingResultsDataTablesLainLain = false;

          this.totalRecordsDataTablesLainLain = this.dataTablesLainLain.length;

          this.patchValue();
          // ===============================================
        },
        (error: any) => {
          this.appAlertService.error(error.errors);
        },
          () => { this.uiBlockService.hideUiBlock(); }
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

  // Dipanggil saat terjadi resize terhadap div yang menampung data table, agar width dari data table
  // dapat di set
  onDivDataTableResized(event: ResizedEvent) {
    const width = event.newWidth - 90;
    this.dataTablesWidth = width + 'px';
  }

  public back() {

    if (this.previousUrl === '/transaksi/invoice-manual') {
      const sessionData = SessionHelper.getItem('TINVMANUAL-BROWSE-SCR', this.lzStringService);

      // agar layar sebelumnya tahu bahwa ada aksi kembali dari detail
      // ini untuk membedakan antara layar sebelumnya dibuka via menu dan dibuka via back dari detail
      sessionData.fromDetail = true; 
      SessionHelper.setItem('TINVMANUAL-BROWSE-SCR', sessionData, this.lzStringService);
  
      // this.router.navigate(['../../../'], { relativeTo: this.route });  
      this.router.navigate([this.previousUrl]);
    } else {
      this.router.navigate([this.previousUrl]);
    }
  }

  private dataBridging() {

    const sessionData = SessionHelper.getItem('TINVMANUAL-H', this.lzStringService);
    this.previousUrl = sessionData.urlAsal;

    if (sessionData.mode === 'edit') {
      this.selectedData = sessionData.data.header;
      this.dataTablesLainLain = sessionData.data.detailLainLain;

      this.isLoadingResultsDataTablesLainLain = false;

      this.mode = 'edit';
      this.initInputForm();

    } else {
      this.selectedData = sessionData.data.header;
      this.dataTablesLainLain = sessionData.data.detailLainLain;

      this.isLoadingResultsDataTablesLainLain = false;

      this.mode = 'add';

  }

    this.totalRecordsDataTablesLainLain = this.dataTablesLainLain.length;

    // memberi keyIn untuk keperluan input di grid DAN untuk expandable rows error message pada data tables
    this.dataTablesLainLain.map(item => {
      item.keyIn = uuidv4(); 
    });

    // ambil untuk tampilan unit pengali deposit beserta satuan siklus nya
    let nildep = 0;
    let jumbul = 1;
    let jumsiklus = 1;
    let satsiklus = '';

    this.dataTablesLainLain.map(item => {
      if (!item.isSelect) {
        // karena isi detil initial pasti cuma satu yang aktif, maka bisa langsung diambil
        nildep = nildep + item.netto;
        jumbul = 1;  
      }
    })

    this.inputForm.controls.nildep.patchValue(nildep);
    this.inputForm.controls.jumbul.patchValue(jumbul);
    this.inputForm.controls.jumsiklus.patchValue(jumsiklus);
    this.inputForm.controls.satsiklus.patchValue(satsiklus);

    this.patchValue();

    if (sessionData.prevTabName === 'tab1Index') {
      if (sessionData.prevTab !== undefined && sessionData.prevTab > 0) {
        this.tab1Index = sessionData.prevTab - 1;
      }
    }

  }

  // AUTOCOMPLETE
  // Untuk autocomplete customer
  public filterCustomer(event) {

    this.uiBlockService.showUiBlock();
    const searchParams = {
      nama: event.query,
      flakt: 'Y',
    };
    const sort: any = {
      nama: 'asc',
    };

    this.customerService
    .search(searchParams, sort)
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe(
      (result: StdResponse<Customer[]>) => {
        // this.uiBlockService.hideUiBlock();

        this.filteredCustomer = result.data;
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

  // Untuk verifikasi inputan di autocomplete customer
  public verifikasiAutocompleteCustomer(data: any) {

    let periksa = false;
    if (typeof data === 'string') {
      // ini pasti inputan autocomplete berdasarkan ketikan bukan select dari pilihan
      // oleh sebab itu harus diperiksa
      periksa = true;
    }

    if (periksa) {
      this.uiBlockService.showUiBlock();

      this.customerService
      .getByNama(data)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (result: StdResponse<Customer>) => {

          if (result.data) {
            this.inputForm.controls.customer.patchValue(result.data);
          } else {
            this.inputForm.controls.customer.patchValue(new Customer());
          }
          // this.uiBlockService.hideUiBlock();

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

  public selectedCustomer() {

    this.inputForm.controls.nmcust.patchValue(this.inputForm.controls.customer.value.billcust2);
    this.inputForm.controls.nama.patchValue(this.inputForm.controls.customer.value.billnama2);
    this.inputForm.controls.alamat.patchValue(this.inputForm.controls.customer.value.billalamat2);
    this.inputForm.controls.email.patchValue(this.inputForm.controls.customer.value.billemail2);  

    this.clearDetilInitial();
  }

  public getBillCustomerIni() {
    this.inputForm.controls.nmcust.patchValue(this.inputForm.controls.customer.value.nama);
    this.inputForm.controls.nama.patchValue(this.inputForm.controls.customer.value.billnama);
    this.inputForm.controls.alamat.patchValue(this.inputForm.controls.customer.value.billalamat);
    this.inputForm.controls.email.patchValue(this.inputForm.controls.customer.value.billemail);  
  }

  public selectedProduk() {
    this.clearDetilInitial();
  }

  private totalNilaiBruto() {
    let totalBruto = 0;
    let totalDiscount = 0;
    let totalNetto = 0;
    
    let nildep = 0;
    let jumbul = 1;
    let jumsiklus = 1;
    let satsiklus = '';

    this.dataTablesLainLain.map(item => {
      if (!item.isSelect) {
        totalBruto = totalBruto + item.harga;
        totalDiscount = totalDiscount + item.nilpctdisc;
        totalDiscount = totalDiscount + item.nildisc;
        totalNetto = totalNetto + item.netto;

        nildep = nildep + item.netto;
      }
    })

    this.inputForm.controls.nildep.patchValue(nildep);
    this.inputForm.controls.jumbul.patchValue(jumbul);
    this.inputForm.controls.jumsiklus.patchValue(jumsiklus);
    this.inputForm.controls.satsiklus.patchValue(satsiklus);

    //const ppn = Math.floor(totalNetto * (10/100));
    this.inputForm.controls.bruto.patchValue(totalBruto);
    this.inputForm.controls.totdisc.patchValue(totalDiscount);
    let dpp = totalBruto - totalDiscount - 
              this.inputForm.controls.nildis.value -this.inputForm.controls.depused.value;
    const ppn = Math.floor(dpp * (10/100));

    //this.inputForm.controls.dpp.patchValue(totalNetto);
    this.inputForm.controls.dpp.patchValue(dpp);
    this.inputForm.controls.ppn.patchValue(ppn);
    //this.inputForm.controls.netto.patchValue(totalNetto + ppn);
    this.inputForm.controls.netto.patchValue(dpp + ppn);
  }

  public detilLainLainChanged() {
    this.totalNilaiBruto();
  }

  public detilTrainingChanged() {
    this.totalNilaiBruto();
  }

  public detilImplementasiChanged() {
    this.totalNilaiBruto();
  }

  public detilInitialChanged() {
    this.totalNilaiBruto();
  }

  public detilLainLainMasterChanged() {
    this.totalNilaiBruto();
  }

  public depusedChanged() {

    let dpp = this.inputForm.controls.bruto.value - this.inputForm.controls.totdisc.value - 
              this.inputForm.controls.nildis.value -this.inputForm.controls.depused.value;

    const ppn = Math.floor(dpp * (10/100));
    this.inputForm.controls.dpp.patchValue(dpp);
    this.inputForm.controls.ppn.patchValue(ppn);
    this.inputForm.controls.netto.patchValue(dpp + ppn);
  }

  public radioButtonDepositChanged() {
    if (this.inputForm.controls.fltodep.value === 'Y') {
      this.inputForm.controls.depused.patchValue(0);
      this.inputForm.controls.depused.disable();
    } else {
      this.inputForm.controls.depused.enable();
    }
  }

  private clearDetilInitial() {
    this.inputForm.controls.nildep.patchValue(0);
  }

  public hitungNilaiDiskonDariProsen() {
    this.inputForm.controls.nildis.patchValue(0);
    const total = this.inputForm.controls.bruto.value - this.inputForm.controls.totdisc.value;
    const prosen = this.inputForm.controls.pctdis.value;

    this.inputForm.controls.nildis.patchValue(Math.floor((prosen * total) / 100));
    
    this.depusedChanged();
  }  

  public hitungProsenDariNilai() {
    this.inputForm.controls.pctdis.patchValue(0);
    const total = this.inputForm.controls.bruto.value - this.inputForm.controls.totdisc.value;
    const nildis = this.inputForm.controls.nildis.value;

    this.inputForm.controls.pctdis.patchValue((nildis * 100) / total);

    this.depusedChanged();
  }
  
  public showInfoCustomer() {

    const pass = new Customer();
    pass.nama = this.inputForm.controls.nama.value;

    this.bsModalInfoCustomer = this.dialogService.open(InfoCustomerComponent, {
      width: '70%',
      contentStyle: {'max-height': 'auto', overflow: 'auto'},
      baseZIndex: 10000,
      data: {
        mode: 'add',
        passedData: pass,
      }
    });

    this.bsModalInfoCustomer.onClose.subscribe((data: any) => {

      const returnedData = data.selectedData;
      const mode = data.mode;

      if (returnedData) {
        this.inputForm.controls.customer.patchValue(returnedData);
        this.selectedCustomer();
      }
    },
    () => {
    });
  }

}
