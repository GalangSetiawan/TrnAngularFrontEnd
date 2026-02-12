import { StdFieldMappingHint } from 'src/app/common/common-class/standar-api-mapper';

export class MasterBarang {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
  ];

  public id: string = null;
  public kodeBarang: string = null;
  public namaBarang: string = null;
  public unit1: string = null;
  public konversiUnit1KeUnit2: number = 0;
  public unit2: string = null;
  public konversiUnit2KeStok: number = 0;
  public unitStok: string = null;
  public aktif: string = 'Y';

  // Standard audit fields
  public version: number = null;
  public usrcrt: string = null;
  public tglcrt: Date = null;
  public jamcrt: string = null;
  public usrupd: string = null;
  public tglupd: Date = null;
  public jamupd: string = null;

  constructor(initial?: Partial<MasterBarang>) {
    Object.assign(this, initial);
  }
}
