import { StdFieldMappingHint } from "src/app/common/common-class/standar-api-mapper";

export class Customer {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
  ];

  public nama: string = null;
  public picnama: string = null;
  public picrole: string = null;
  public picnumber: string = null;
  public picemail: string = null;
  public picalamat: string = null;
  public billnama: string = null;
  public billrole: string = null;
  public billnumber: string = null;
  public billemail: string = null;
  public billalamat: string = null;
  public vabca: string = null;
  public billcust2: string = null;
  public billnama2: string = null;
  public billrole2: string = null;
  public billnumber2: string = null;
  public billemail2: string = null;
  public billalamat2: string = null;
  public flakt: boolean = true;
  public flmainva: boolean = true;

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

  constructor(initial?: Partial<Customer>) {
    Object.assign(this, initial);
  }
}

