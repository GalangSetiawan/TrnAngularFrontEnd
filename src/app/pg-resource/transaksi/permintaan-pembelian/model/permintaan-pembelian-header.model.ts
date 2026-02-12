import { StdFieldMappingHint } from 'src/app/common/common-class/standar-api-mapper';
import { MasterBagian } from 'src/app/pg-resource/master/bagian/model/bagian.model';

export class PermintaanPembelianHeader {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'tanggal', dataType: 'date' },
    { model: 'bagian', dataType: MasterBagian },
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
  ];

  public nomor: string = null;
  public tanggal: Date = null;
  public bagian: MasterBagian = new MasterBagian();
  public keterangan: string = null;

  // Standard audit fields
  public id: string = null;
  public version: number = null;
  public usrcrt: string = null;
  public tglcrt: Date = null;
  public jamcrt: string = null;
  public usrupd: string = null;
  public tglupd: Date = null;
  public jamupd: string = null;

  constructor(initial?: Partial<PermintaanPembelianHeader>) {
    Object.assign(this, initial);
  }
}
