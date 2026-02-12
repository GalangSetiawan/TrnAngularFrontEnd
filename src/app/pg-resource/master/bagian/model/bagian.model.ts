import { StdFieldMappingHint } from 'src/app/common/common-class/standar-api-mapper';

export class MasterBagian {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
  ];

  public id: string = null;
  public kodeBagian: string = null;
  public namaBagian: string = null;
  public aktif: string = 'Y';

  // Standard audit fields
  public version: number = null;
  public usrcrt: string = null;
  public tglcrt: Date = null;
  public jamcrt: string = null;
  public usrupd: string = null;
  public tglupd: Date = null;
  public jamupd: string = null;

  constructor(initial?: Partial<MasterBagian>) {
    Object.assign(this, initial);
  }
}
