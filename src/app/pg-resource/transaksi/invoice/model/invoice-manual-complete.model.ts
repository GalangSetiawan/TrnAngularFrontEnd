import { StdFieldMappingHint } from 'src/app/common/common-class/standar-api-mapper';
import { InvoiceHeader } from './invoice-header.model';
import { InvoiceDetailLainLain } from './invoice-detail-lainlain.model';

export class InvoiceManualComplete {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'header', dataType: InvoiceHeader },
    { model: 'detailLainLain', dataType: InvoiceDetailLainLain },
    { model: 'tgtrn', dataType: 'date' },
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
    { model: 'tgjtemp', dataType: 'date' },
  ];
  public header: InvoiceHeader = new InvoiceHeader();

  public detailLainLain: InvoiceDetailLainLain[] = [];

  // untuk expandable rows
  public keyIn: string = null;

  // untuk checkbox bahwa jurnal ini dipilih untuk dibuatkan jurnal rutin
  public isSelect: boolean = false;

  constructor(initial?: Partial<InvoiceManualComplete>) {
    Object.assign(this, initial);
  }
}

