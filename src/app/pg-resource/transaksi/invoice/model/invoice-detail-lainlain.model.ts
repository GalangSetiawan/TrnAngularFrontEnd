import { StdFieldMappingHint } from 'src/app/common/common-class/standar-api-mapper';
import { InvoiceHeader } from './invoice-header.model';

export class InvoiceDetailLainLain {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'header', dataType: InvoiceHeader },
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
  ];

  public header: InvoiceHeader = new InvoiceHeader();

  public nourut: number = 0;
  public keterangan: string = null;
  public harga: number = 0;
  public pctdisc: number = 0;
  public nilpctdisc: number = 0;
  public nildisc: number = 0;
  public netto: number = 0;

  // untuk input di grid
  public keyIn: string = null;
  public isEdit: string = 'N';
  public isError: string = 'N';
  public errorMsg: string = null;
  public editMode: string = null;
  public isDeleted: boolean = false;
  public isSelect: boolean = false;

  // harus ada di setiap model
  public id: string = null;
  public version: number = null;
  public usrcrt: string = null;
  public tglcrt: Date = null;
  public jamcrt: string = null;
  public usrupd: string = null;
  public tglupd: Date = null;
  public jamupd: string = null;

  constructor(initial?: Partial<InvoiceDetailLainLain>) {
    Object.assign(this, initial);
  }
}

