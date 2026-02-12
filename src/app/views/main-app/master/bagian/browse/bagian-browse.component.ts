import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { BreadCrumbService } from 'src/app/common/common-components/breadcrumb/breadcrumb.service';
import { StdPagingRequest } from 'src/app/common/common-model/standar-api-request.model';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { FEComboConstantService } from 'src/app/common/common-services/fe.combo.constants.service';
import { MasterBagian } from 'src/app/pg-resource/master/bagian/model/bagian.model';
import { MasterBagianService } from 'src/app/pg-resource/master/bagian/bagian.service';
import { SessionHelper } from 'src/app/helper/session-helper';
import { LZStringService } from 'ng-lz-string';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-bagian-browse',
  templateUrl: './bagian-browse.component.html',
  styleUrls: ['./bagian-browse.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BagianBrowseComponent implements OnInit, OnDestroy, AfterViewChecked {

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'MasterBagian';
  public searchForm: FormGroup;
  public dataTables: MasterBagian[] = [];
  public numberOfRowsDataTables = 10;
  public isLoadingResultsDataTables = false;
  public totalRecordsDataTables = 0;
  public colsDataTables: any[];
  public pagingSearch: StdPagingRequest = null;
  public firstSearch = 0;
  public searchParamsSearch: any;
  public sortSearch: any;
  public radioButtonAktif: any[];
  public dataTablesWidth = '0px';

  constructor(
    private fb: FormBuilder,
    private appAlertService: AppAlertService,
    private confirmationService: ConfirmationService,
    private uiBlockService: UiBlockService,
    private translateService: TranslateService,
    private bagianService: MasterBagianService,
    private feComboConstantService: FEComboConstantService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private breadCrumbService: BreadCrumbService,
    public defaultLanguageState: DefaultLanguageState,
    private lzStringService: LZStringService
  ) {
    this.pagingSearch = {
      page: 1,
      perPage: this.numberOfRowsDataTables
    };
    this.sortSearch = {
      namaBagian: 'asc'
    };
    this.searchParamsSearch = {
      kodeBagian: null,
      namaBagian: null,
      aktif: null
    };
  }

  public ngOnInit() {
    this.breadCrumbService.sendReloadInfo('reload');
    this.initSearchForm();
    this.initRadioButtonAktif();
    this.initColsDataTables();
    this.loadFromSession();
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
      kodeBagian: [''],
      namaBagian: [''],
      aktif: ['']
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
        },
        (error) => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  private initColsDataTables() {
    this.colsDataTables = [
      { field: 'kodeBagian', header: 'KodeBagian', width: '200px' },
      { field: 'namaBagian', header: 'NamaBagian', width: '400px' },
      { field: 'aktif', header: 'Status', width: '150px' }
    ];
  }

  private loadFromSession() {
    const sessionData = SessionHelper.getItem('MBAGIAN-BROWSE-SCR', this.lzStringService);

    if (sessionData && sessionData.fromDetail) {
      this.searchForm.patchValue(sessionData.searchParams);
      this.pagingSearch = sessionData.paging;
      this.firstSearch = sessionData.tableFirst;
      this.numberOfRowsDataTables = sessionData.tableNumberOfRows;
      sessionData.fromDetail = false;
      SessionHelper.setItem('MBAGIAN-BROWSE-SCR', sessionData, this.lzStringService);
    }

    this.loadData();
  }

  public loadData() {
    this.isLoadingResultsDataTables = true;

    this.searchParamsSearch = {
      kodeBagian: this.searchForm.controls.kodeBagian.value,
      namaBagian: this.searchForm.controls.namaBagian.value,
      aktif: this.searchForm.controls.aktif.value
    };

    this.bagianService
      .search(this.searchParamsSearch, this.sortSearch, this.pagingSearch)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (result:any) => {
          this.isLoadingResultsDataTables = false;
          this.dataTables = result.data;
          this.totalRecordsDataTables = result.info ? result.info.totalRecord : 0;

          const sessionData = {
            searchParams: this.searchParamsSearch,
            paging: this.pagingSearch,
            tableFirst: this.firstSearch,
            tableNumberOfRows: this.numberOfRowsDataTables,
            fromDetail: false
          };
          SessionHelper.setItem('MBAGIAN-BROWSE-SCR', sessionData, this.lzStringService);
        },
        (error) => {
          this.isLoadingResultsDataTables = false;
          this.appAlertService.error(error.errors);
        },
        () => {
          this.uiBlockService.hideUiBlock();
        }
      );
  }

  public onSearch() {
    this.firstSearch = 0;
    this.pagingSearch.page = 1;
    this.loadData();
  }

  public onReset() {
    this.searchForm.reset();
    this.onSearch();
  }

  public paginate(event: any) {
    this.pagingSearch.page = event.first / event.rows + 1;
    this.pagingSearch.perPage = event.rows;
    this.firstSearch = event.first;
    this.numberOfRowsDataTables = event.rows;
    this.loadData();
  }

  public onSort(event: any) {
    this.sortSearch = {};
    this.sortSearch[event.field] = event.order === 1 ? 'asc' : 'desc';
    this.loadData();
  }

  public onAdd() {
    const dataKomplit = new MasterBagian();
    const sessionData = {
      data: dataKomplit,
      mode: 'add',
      urlAsal: '/master/bagian'
    };
    SessionHelper.setItem('MBAGIAN-H', sessionData, this.lzStringService);

    this.router.navigate(['input'], {
      relativeTo: this.route
    });
  }

  public onEdit(data: MasterBagian) {
    const sessionData = {
      data: data,
      mode: 'edit',
      urlAsal: '/master/bagian'
    };
    SessionHelper.setItem('MBAGIAN-H', sessionData, this.lzStringService);

    this.router.navigate(['input'], {
      relativeTo: this.route
    });
  }

  public onView(data: MasterBagian) {
    const sessionData = {
      data: data,
      mode: 'view',
      urlAsal: '/master/bagian'
    };
    SessionHelper.setItem('MBAGIAN-H', sessionData, this.lzStringService);

    this.router.navigate(['input'], {
      relativeTo: this.route
    });
  }

  public onDelete(data: MasterBagian) {
    this.translateService.get('HapusData')
      .subscribe((translation) => {
        this.confirmationService.confirm({
          message: translation + ' ' + data.namaBagian + ' ?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.uiBlockService.showUiBlock();
            this.bagianService
              .delete(data)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                (result) => {
                  this.uiBlockService.hideUiBlock();
                  this.translateService.get('HapusBerhasil')
                    .subscribe((translation) => {
                      this.appAlertService.instantInfo(translation);
                    });
                  this.loadData();
                },
                (error) => {
                  this.uiBlockService.hideUiBlock();
                  this.appAlertService.error(error.errors);
                },
                () => {
                  this.uiBlockService.hideUiBlock();
                }
              );
          },
          reject: () => {
          }
        });
      });
  }

  onDivDataTableResized(event: ResizedEvent) {
    const width = event.newWidth - 90;
    this.dataTablesWidth = width + 'px';
  }
}
