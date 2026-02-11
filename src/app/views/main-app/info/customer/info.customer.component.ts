import { Component, OnInit } from '@angular/core';
import { Subject} from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Location } from '@angular/common';

import { ConfirmationService } from 'primeng/api';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { StdPagingRequest } from 'src/app/common/common-model/standar-api-request.model';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { PagingHelper } from 'src/app/helper/paging-helper';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { Customer } from 'src/app/pg-resource/master/customer/model/customer.model';
import { CustomerService } from 'src/app/pg-resource/master/customer/customer.service';

@Component({
  selector: 'app-info-customer',
  templateUrl: './info.customer.component.html',

})

export class InfoCustomerComponent implements OnInit {

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public title = 'InfoCustomer';

  public filterForm: FormGroup;


  public dataTables: Customer[] = [];
  public numberOfRowsDataTables = 5;
  public isLoadingResultsDataTables = false;
  public totalRecordsDataTables = 0;

  public pagingSearch1: StdPagingRequest = null;
  public firstSearch1 = 0;
  public searchParamsSearch1: any;
  public sortSearch1: any;

  public selectedData: Customer;
  public mode: string;

  public passedData: Customer;

  constructor(
    private fb: FormBuilder,
    private appAlertService: AppAlertService,
    private confirmationService: ConfirmationService,
    private uiBlockService: UiBlockService,
    private translateService: TranslateService,
    public defaultLanguageState: DefaultLanguageState,
    private customerService: CustomerService,
    private bsModalRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
    this.pagingSearch1 = {
      page: 1,
      perPage: this.numberOfRowsDataTables
    };
    this.sortSearch1 = {
      nama: 'asc',
      picnama: 'asc',
    };
    this.searchParamsSearch1 = {
      nama: null,
    };
    this.translateService.get(this.title)
      .subscribe((translation) => {
        this.title = translation;
        this.config.header = this.title;
      }
    );

  }

  public ngOnInit() {
    this.passedData = this.config.data.passedData;
    this.selectedData = this.config.data.selectedData;
    this.mode = this.config.data.mode;

    this.initFilterForm();
    this.patchValue();
    this.search1();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  private initFilterForm() {
    this.filterForm = this.fb.group({
      nama: [''],
      picnama: [''],
    });
  }

  private patchValue() {
    if (this.passedData) {
      this.filterForm.patchValue({
        nama: (this.passedData.nama == null ? '' : this.passedData.nama.trim()),
        picnama: (this.passedData.picnama == null ? '' : this.passedData.picnama.trim()),
      });
    }
  }

  public search1() {

    this.isLoadingResultsDataTables = false;
    this.uiBlockService.showUiBlock();

    this.pagingSearch1 = {
      page: 1,
      perPage: this.numberOfRowsDataTables
    };

    let namaFilter = null;
    let picnamaFilter = null;

    if (this.filterForm.value.nama) {
      namaFilter = this.filterForm.value.nama;
    }

    if (this.filterForm.value.picnama) {
      picnamaFilter = this.filterForm.value.picnama;
    }

    this.searchParamsSearch1 = {
      nama: namaFilter,
      picnama: picnamaFilter,
    };

    this.customerService
    .search(this.searchParamsSearch1, this.sortSearch1, this.pagingSearch1)
    .pipe(
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe(
      (result: StdResponse<Customer[]>) => {
        this.isLoadingResultsDataTables = false;
        this.uiBlockService.hideUiBlock();
        this.dataTables = result.data;
        this.totalRecordsDataTables = result.meta.pagination.dataCount;

      },
      (error) => {
        this.isLoadingResultsDataTables = false;
        this.uiBlockService.hideUiBlock();

        this.appAlertService.error(error.errors);
      },
      () => {
        this.isLoadingResultsDataTables = false;
        this.uiBlockService.hideUiBlock();
      }
    );
  }

  public doInstantFilterSearch1(event?: any) {
    if (event) {
      const pagination = PagingHelper.getPaging(event);

      pagination.searchParams = this.searchParamsSearch1;

      if (pagination.sorts === null) {
        pagination.sorts = this.sortSearch1;
      } else {
        this.sortSearch1 = pagination.sorts;
      }

      if (pagination.paging === null) {
        pagination.paging = this.pagingSearch1;
      } else {
        this.pagingSearch1 = pagination.paging;
      }
      this.firstSearch1 = event.first;

      this.isLoadingResultsDataTables = true;
      this.uiBlockService.showUiBlock();
      this.customerService
      .search(pagination.searchParams, pagination.sorts, pagination.paging)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (result: StdResponse<Customer[]>) => {
          this.isLoadingResultsDataTables = false;
          this.uiBlockService.hideUiBlock();
          this.dataTables = result.data;
          this.totalRecordsDataTables = result.meta.pagination.dataCount;

        },
        (error) => {
          this.isLoadingResultsDataTables = false;
          this.uiBlockService.hideUiBlock();

          this.appAlertService.error(error.errors);
        },
        () => {
          this.isLoadingResultsDataTables = false;
          this.uiBlockService.hideUiBlock();
        }
      );
    }
  }

  public refreshDataDataTables() {
    this.search1();
  }

  public onSelected(kelompokBarang: Customer) {
    this.selectedData = kelompokBarang;
    this.hide();
  }

  public hide() {
    this.bsModalRef.close({selectedData: this.selectedData, mode: this.mode});
  }

  public backBack1() {
    this.bsModalRef.close({selectedData: this.selectedData, mode: this.mode});
  }

}
