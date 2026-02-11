import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';

import { DialogService, DynamicDialogRef } from 'primeng';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { InvoiceDetailLainLain } from 'src/app/pg-resource/transaksi/invoice/model/invoice-detail-lainlain.model';
import { DetilLainLainInputComponent } from './input-detil-lain-lain/detil-lain-lain-input.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-tabel-detil-lain-lain',
  templateUrl: './tabel-detil-lain-lain.component.html',
  styleUrls: ['./tabel-detil-lain-lain.component.scss'],
  providers: [DialogService],
  encapsulation : ViewEncapsulation.None
})

export class TabelDetilLainLainComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() dataTables: InvoiceDetailLainLain[];
  @Input() totalRecordsDataTables: number;
  @Input() isLoadingResultsDataTables: false;  
  @Input() expandedRowsDataTables: {};  
  @Input() dataTablesWidth: number;

  @Output() dataTablesChange = new EventEmitter<InvoiceDetailLainLain[]>();

  bsModalInputDetilLainLain: DynamicDialogRef;

  public tab1Index = 0;
  public firstSearch = 0;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  public numberOfRowsDataTables = 5;

  public colsDataTables: any[];

  // default sort untuk datatables
  public multiSortMeta = [];

  constructor(
    private appAlertService: AppAlertService,
    private translateService: TranslateService,
    public defaultLanguageState: DefaultLanguageState,
    private cdRef: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {
  }

  public ngOnInit() {
    this.initColsDataTables();
    this.initDefaultMultiSort();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public initColsDataTables() {
    this.colsDataTables = [
      { field: 'nourut', header: 'NoUrut', rtl: true, type: 'string', width: '50px' },
      { field: 'keterangan', header: 'Keterangan', rtl: false, type: 'string', width: '220px' },
      { field: 'harga', header: 'Harga', rtl: true, type: 'string', width: '220px' },
      { field: 'pctdisc', header: 'ProsenDisc', rtl: true, type: 'string', width: '220px' },
      { field: 'nilpctdisc', header: 'NilaiProsenDisc', rtl: true, type: 'string', width: '220px' },
      { field: 'nildisc', header: 'NilaiDisc', rtl: true, type: 'string', width: '220px' },
      { field: 'netto', header: 'Total', rtl: true, type: 'string', width: '220px' },
    ];
  }

  public initDefaultMultiSort() {
    this.multiSortMeta.push({field: 'nourut', order: 1});
  }

  public deleteSelectorDataTables(event: any) {

    this.dataTables.map((item) => {
      item.isSelect = event.checked;
    });
    this.dataTables.slice();

    this.dataTablesChange.emit(this.dataTables);
  }

  public deleteRowDataTables(row: any) {

    this.dataTablesChange.emit(this.dataTables);
  }

  public editDataTables(inData: InvoiceDetailLainLain) {


    this.bsModalInputDetilLainLain = this.dialogService.open(DetilLainLainInputComponent, {
      width: '55%',
      contentStyle: {'max-height': 'auto', overflow: 'auto'},
      baseZIndex: 10000,
      data: {
        mode: 'edit',
        selectedData: inData,
      }
    });

    const sub = this.bsModalInputDetilLainLain.onClose.subscribe((data: any) => {

      const returnedData = data.selectedData;
      const mode = data.mode;

      if (returnedData) {
        if (mode === 'edit') {

          const updateItem = this.dataTables.find((item) => item.nourut === returnedData.nourut);

          const index = this.dataTables.indexOf(updateItem);

          this.dataTables[index] = returnedData;

          this.dataTablesChange.emit(this.dataTables);
        }
      }
      sub.unsubscribe();
    },
    () => {
    });
  }

  public addDataTables() {

    // cari nilai nomor urut terakhir untuk masing-masing data tables
    let noUrut = 0;
    this.dataTables.map(item => { 
      if (item.nourut > noUrut) {
        noUrut = item.nourut;
      }
    });
    noUrut = noUrut + 1;

    const newData = new InvoiceDetailLainLain();
    newData.nourut = noUrut;

    this.bsModalInputDetilLainLain = this.dialogService.open(DetilLainLainInputComponent, {
      width: '55%',
      contentStyle: {'max-height': 'auto', overflow: 'auto'},
      baseZIndex: 10000,
      data: {
        mode: 'add',
        selectedData: newData,
      }
    });

    const sub = this.bsModalInputDetilLainLain.onClose.subscribe((data: any) => {

      const returnedData = data.selectedData;
      const mode = data.mode;

      if (returnedData) {
        if (mode === 'add') {
          returnedData.keyIn = uuidv4(); 
          this.dataTables.push(returnedData);
          this.dataTablesChange.emit(this.dataTables);
        }
      }
      sub.unsubscribe();
    },
    () => {
    });
  }
}
