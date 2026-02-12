import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { DialogService, DynamicDialogRef } from 'primeng';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { PermintaanPembelianDetail } from 'src/app/pg-resource/transaksi/permintaan-pembelian/model/permintaan-pembelian-detail.model';
import { DetilInputComponent } from './input-detil/detil-input.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-tabel-detil',
  templateUrl: './tabel-detil.component.html',
  styleUrls: ['./tabel-detil.component.scss'],
  providers: [DialogService],
  encapsulation: ViewEncapsulation.None
})
export class TabelDetilComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() dataSource: PermintaanPembelianDetail[] = [];
  @Input() mode: string;
  @Input() dataTablesWidth: string;
  @Input() expandedRows: {} = {};

  @Output() dataSourceChange = new EventEmitter<PermintaanPembelianDetail[]>();

  bsModalInputDetil: DynamicDialogRef;

  public firstSearch = 0;
  private ngUnsubscribe: Subject<boolean> = new Subject();
  public numberOfRowsDataTables = 10;
  public colsDataTables: any[];
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
      { field: 'nourut', header: 'NoUrut', rtl: false, type: 'number', width: '80px' },
      { field: 'barang.namaBarang', header: 'NamaBarang', rtl: false, type: 'string', width: '250px' },
      { field: 'jumlahDiminta', header: 'JumlahDiminta', rtl: true, type: 'number', width: '150px' },
      { field: 'unitDiminta', header: 'UnitDiminta', rtl: false, type: 'string', width: '120px' },
      { field: 'jumlahUnitStok', header: 'JumlahUnitStok', rtl: true, type: 'number', width: '150px' },
      { field: 'unitStok', header: 'UnitStok', rtl: false, type: 'string', width: '120px' },
    ];
  }

  public initDefaultMultiSort() {
    this.multiSortMeta.push({ field: 'nourut', order: 1 });
  }

  public deleteSelectorDataTables(event: any) {
    this.dataSource.map((item) => {
      item.isSelect = event.checked;
    });
    this.dataSource.slice();
    this.dataSourceChange.emit(this.dataSource);
  }

  public deleteSelectedRows() {
    const itemsToDelete = this.dataSource.filter(item => item.isSelect);

    if (itemsToDelete.length === 0) {
      this.translateService.get('PilihDataYangAkanDihapus')
        .subscribe((translation) => {
          this.appAlertService.instantWarn(translation);
        });
      return;
    }

    // Hapus item yang dipilih
    for (let i = this.dataSource.length - 1; i >= 0; i--) {
      if (this.dataSource[i].isSelect) {
        this.dataSource.splice(i, 1);
      }
    }

    // Renumber nourut
    this.renumberNourut();

    this.dataSourceChange.emit(this.dataSource);
  }

  public editDataTables(inData: PermintaanPembelianDetail) {
    this.bsModalInputDetil = this.dialogService.open(DetilInputComponent, {
      width: '55%',
      contentStyle: { 'max-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        mode: 'edit',
        selectedData: inData,
      }
    });

    const sub = this.bsModalInputDetil.onClose.subscribe((data: any) => {
      const returnedData = data.selectedData;
      const mode = data.mode;

      if (returnedData) {
        if (mode === 'edit') {
          const updateItem = this.dataSource.find((item) => item.keyIn === returnedData.keyIn);
          const index = this.dataSource.indexOf(updateItem);
          this.dataSource[index] = returnedData;
          this.dataSourceChange.emit(this.dataSource);
        }
      }
      sub.unsubscribe();
    },
      () => {
      });
  }

  public addDataTables() {
    // cari nilai nomor urut terakhir
    let noUrut = 0;
    this.dataSource.map(item => {
      if (item.nourut > noUrut) {
        noUrut = item.nourut;
      }
    });
    noUrut = noUrut + 1;

    const newData = new PermintaanPembelianDetail();
    newData.nourut = noUrut;
    newData.keyIn = uuidv4();

    this.bsModalInputDetil = this.dialogService.open(DetilInputComponent, {
      width: '55%',
      contentStyle: { 'max-height': 'auto', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        mode: 'add',
        selectedData: newData,
      }
    });

    const sub = this.bsModalInputDetil.onClose.subscribe((data: any) => {
      const returnedData = data.selectedData;
      const mode = data.mode;

      if (returnedData) {
        if (mode === 'add') {
          returnedData.keyIn = uuidv4();
          this.dataSource.push(returnedData);
          this.dataSourceChange.emit(this.dataSource);
        }
      }
      sub.unsubscribe();
    },
      () => {
      });
  }

  private renumberNourut() {
    this.dataSource.forEach((item, index) => {
      item.nourut = index + 1;
    });
  }
}
