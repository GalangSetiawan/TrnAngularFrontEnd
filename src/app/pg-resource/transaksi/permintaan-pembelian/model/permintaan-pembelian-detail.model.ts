import { StdFieldMappingHint } from 'src/app/common/common-class/standar-api-mapper';
import { MasterBarang } from 'src/app/pg-resource/master/barang/model/barang.model';

export class PermintaanPembelianDetail {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'barang', dataType: MasterBarang },
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
  ];

  public barang: MasterBarang = new MasterBarang();
  public nourut: number = 0;
  public jumlahDiminta: number = 0;
  public unitDiminta: string = null;
  public jumlahUnitStok: number = 0;
  public unitStok: string = null;

  // Untuk input di grid - WAJIB ada untuk grid handling
  public keyIn: string = null;
  public isEdit: string = 'N';
  public isError: string = 'N';
  public errorMsg: string = null;
  public editMode: string = null;
  public isDeleted: boolean = false;
  public isSelect: boolean = false;

  // Standard audit fields
  public id: string = null;
  public version: number = null;
  public usrcrt: string = null;
  public tglcrt: Date = null;
  public jamcrt: string = null;
  public usrupd: string = null;
  public tglupd: Date = null;
  public jamupd: string = null;

  constructor(initial?: Partial<PermintaanPembelianDetail>) {
    Object.assign(this, initial);
  }
}
