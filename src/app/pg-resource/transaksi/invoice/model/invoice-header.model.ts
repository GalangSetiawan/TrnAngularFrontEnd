import { StdFieldMappingHint } from 'src/app/common/common-class/standar-api-mapper';
import { Customer } from 'src/app/pg-resource/master/customer/model/customer.model';
import { InvoiceDetailLainLain } from './invoice-detail-lainlain.model';

export class InvoiceHeader {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
    { model: 'tgjtemp', dataType: 'date' },
  ];

  public nomor: string = null;
  public tgtrn: Date = null;
  public nmcust: string = null;
  public nama: string = null;
  public alamat: string = null;
  public email: string = null;
  public status: string = null;
  public bruto: number = 0;
  public totdisc: number = 0;
  public dpp: number = 0;
  public ppn: number = 0;
  public netto: number = 0;
  public depused: number = 0;
  public fltodep: boolean = true;
  public nildep: number = 0;
  public tgjtemp: Date = null;
  public flasli: boolean = false;
  public notes: string = null;
  public pctdis: number = 0;
  public nildis: number = 0;
  public ketdis: string = null;
  public ketinv: string = null;
  public nilbyr: number = 0;
  
  public customer: Customer = new Customer();

  public detailLainLain: InvoiceDetailLainLain[] = [];

  // field untuk bantu display berapa hari jatuh tempo dan zonasi nya
  public jthtempo: number = 0;
  public zona: number = 0;

  // field bantu untuk input kirim/tidak
  public flsent: boolean = false;
  // field bantu untuk input bayar/tidak
  public flbayar: boolean = false;
  // field bantu untuk select invoice di Kelola Invoice
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

  constructor(initial?: Partial<InvoiceHeader>) {
    Object.assign(this, initial);
  }
}

