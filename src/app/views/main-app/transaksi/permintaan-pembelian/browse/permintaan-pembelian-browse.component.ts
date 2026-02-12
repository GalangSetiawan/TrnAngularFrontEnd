import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { StdPagingRequest } from 'src/app/common/common-model/standar-api-request.model';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { SessionHelper } from 'src/app/helper/session-helper';
import { LZStringService } from 'ng-lz-string';
import { ResizedEvent } from 'angular-resize-event';
import { BreadCrumbService } from 'src/app/common/common-components/breadcrumb/breadcrumb.service';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { PermintaanPembelianHeader } from 'src/app/pg-resource/transaksi/permintaan-pembelian/model/permintaan-pembelian-header.model';
import { PermintaanPembelianService } from 'src/app/pg-resource/transaksi/permintaan-pembelian/permintaan-pembelian.service';
import { PermintaanPembelianComplete } from 'src/app/pg-resource/transaksi/permintaan-pembelian/model/permintaan-pembelian-complete.model';

@Component({
  selector: 'app-permintaan-pembelian-browse',
  templateUrl: './permintaan-pembelian-browse.component.html',
  styleUrls: ['./permintaan-pembelian-browse.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PermintaanPembelianBrowseComponent implements OnInit, OnDestroy, AfterViewChecked {

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'PermintaanPembelian';
  public searchForm: FormGroup;
  public dataTables: PermintaanPembelianHeader[] = [];
  public numberOfRowsDataTables = 10;
  public isLoadingResultsDataTables = false;
  public totalRecordsDataTables = 0;
  public colsDataTables: any[];
  public pagingSearch: StdPagingRequest = null;
  public firstSearch = 0;
  public searchParamsSearch: any;
  public sortSearch: any;
  public dataTablesWidth = '0px';

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
    private cdRef: ChangeDetectorRef,
    private breadCrumbService: BreadCrumbService,
    public defaultLanguageState: DefaultLanguageState,
  ) {
    this.pagingSearch = {
      page: 1,
      perPage: this.numberOfRowsDataTables
    };
    this.sortSearch = {
      nomor: 'asc',
      tanggal: 'desc',
    };
    this.searchParamsSearch = {
      nomor: null,
      tanggal: null,
      bagian: null,
    };
  }

  public ngOnInit() {
    this.breadCrumbService.sendReloadInfo('reload');
    this.initSearchForm();
    this.initColsDataTables();
    this.dataBridging();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  private initSearchForm() {
    this.searchForm = this.fb.group({
      nomor: [''],
      tanggal: [null],
      bagian: [''],
    });

    this.searchParamsSearch = {
      nomor: this.searchForm.controls.nomor.value,
      tanggal: this.searchForm.controls.tanggal.value,
      bagian: this.searchForm.controls.bagian.value,
    };
  }

  private initColsDataTables() {
    this.colsDataTables = [
      { field: 'nomor', header: 'NomorBon', width: '150px' },
      { field: 'tanggal', header: 'TanggalBon', width: '120px' },
      { field: 'bagian.namaBagian', header: 'Bagian', width: '200px' },
      { field: 'keterangan', header: 'Keterangan', width: '300px' },
    ];
  }

  public search() {
    this.isLoadingResultsDataTables = true;
    this.uiBlockService.showUiBlock();

    let nomorFilter = null;
    let tanggalFilter = null;
    let bagianFilter = null;

    if (this.searchForm.controls.nomor.value) {
      nomorFilter = this.searchForm.controls.nomor.value.trim();
    }

    if (this.searchForm.controls.tanggal.value) {
      tanggalFilter = this.searchForm.controls.tanggal.value;
    }

    if (this.searchForm.controls.bagian.value) {
      bagianFilter = this.searchForm.controls.bagian.value.trim();
    }

    this.searchParamsSearch = {
      nomor: nomorFilter,
      tanggal: tanggalFilter,
      bagian: bagianFilter,
    };

    this.dataTables = [];
    this.firstSearch = 0;
    this.pagingSearch.page = 1;

    this.doSearching();
  }

  private doSearching() {
    this.permintaanPembelianService
      .search(this.searchParamsSearch, this.sortSearch, this.pagingSearch)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result:any) => {
          this.uiBlockService.hideUiBlock();
          this.dataTables = result.data;
          this.totalRecordsDataTables = result.info.totalRecord;
          this.isLoadingResultsDataTables = false;
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);
          this.isLoadingResultsDataTables = false;
        },
        () => {
          this.isLoadingResultsDataTables = false;
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  public onPageChange(event: any) {
    this.firstSearch = event.first;
    this.numberOfRowsDataTables = event.rows;
    this.pagingSearch.page = event.first / event.rows + 1;
    this.pagingSearch.perPage = event.rows;

    this.doSearching();
  }

  public add() {
    const dataKomplit = new PermintaanPembelianComplete();
    dataKomplit.header.tanggal = new Date();

    const sessionData = {
      data: dataKomplit,
      mode: 'add',
      urlAsal: '/transaksi/permintaan-pembelian',
      prevTabName: '',
      prevTab: 0,
      tableFirst: this.firstSearch,
      tableNumberOfRows: this.numberOfRowsDataTables
    };

    SessionHelper.setItem('TPERMINTAAN-H', sessionData, this.lzStringService);

    const sessionDataBrowse = {
      searchParamsSearch: this.searchParamsSearch,
      sortSearch: this.sortSearch,
      pagingSearch: this.pagingSearch,
      firstSearch: this.firstSearch,
      fromDetail: false
    };
    SessionHelper.setItem('TPERMINTAAN-BROWSE-SCR', sessionDataBrowse, this.lzStringService);

    this.router.navigate(['input'], { relativeTo: this.route });
  }

  public edit(data: PermintaanPembelianHeader) {
    this.uiBlockService.showUiBlock();

    this.permintaanPembelianService.get(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          const sessionData = {
            data: result.data,
            mode: 'edit',
            urlAsal: '/transaksi/permintaan-pembelian',
            prevTabName: '',
            prevTab: 0,
            tableFirst: this.firstSearch,
            tableNumberOfRows: this.numberOfRowsDataTables
          };

          SessionHelper.setItem('TPERMINTAAN-H', sessionData, this.lzStringService);

          const sessionDataBrowse = {
            searchParamsSearch: this.searchParamsSearch,
            sortSearch: this.sortSearch,
            pagingSearch: this.pagingSearch,
            firstSearch: this.firstSearch,
            fromDetail: false
          };
          SessionHelper.setItem('TPERMINTAAN-BROWSE-SCR', sessionDataBrowse, this.lzStringService);

          this.router.navigate(['input'], { relativeTo: this.route });
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

  public delete(data: PermintaanPembelianHeader) {
    this.translateService.get('HapusTransaksiNomor')
      .subscribe((translation) => {
        this.confirmationService.confirm({
          message: translation + ' ' + data.nomor + ' ?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.doDelete(data);
          },
          reject: () => {
          }
        });
      });
  }

  private doDelete(data: PermintaanPembelianHeader) {
    this.uiBlockService.showUiBlock();
    this.permintaanPembelianService.delete(data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result) => {
          this.translateService.get('HapusBerhasil')
            .subscribe((translation) => {
              this.appAlertService.instantInfo(translation);
            });

          this.search();
        },
        (error: any) => {
          this.uiBlockService.hideUiBlock();
          this.appAlertService.error(error.errors);
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  onDivDataTableResized(event: ResizedEvent) {
    const width = event.newWidth - 90;
    this.dataTablesWidth = width + 'px';
  }

  private dataBridging() {
    const sessionDataBrowse = SessionHelper.getItem('TPERMINTAAN-BROWSE-SCR', this.lzStringService);

    if (sessionDataBrowse) {
      if (sessionDataBrowse.fromDetail) {
        this.searchParamsSearch = sessionDataBrowse.searchParamsSearch;
        this.sortSearch = sessionDataBrowse.sortSearch;
        this.pagingSearch = sessionDataBrowse.pagingSearch;
        this.firstSearch = sessionDataBrowse.firstSearch;

        this.searchForm.patchValue({
          nomor: this.searchParamsSearch.nomor,
          tanggal: this.searchParamsSearch.tanggal,
          bagian: this.searchParamsSearch.bagian,
        });

        sessionDataBrowse.fromDetail = false;
        SessionHelper.setItem('TPERMINTAAN-BROWSE-SCR', sessionDataBrowse, this.lzStringService);

        this.doSearching();
      }
    }
  }
}
