import { StdFieldMappingHint } from 'src/app/common/common-class/standar-api-mapper';
import { PermintaanPembelianHeader } from './permintaan-pembelian-header.model';
import { PermintaanPembelianDetail } from './permintaan-pembelian-detail.model';

export class PermintaanPembelianComplete {

  public static readonly fieldMappingHints: StdFieldMappingHint[] = [
    { model: 'header', dataType: PermintaanPembelianHeader },
    { model: 'details', dataType: PermintaanPembelianDetail },
    { model: 'tanggal', dataType: 'date' },
    { model: 'tglcrt', dataType: 'date' },
    { model: 'tglupd', dataType: 'date' },
  ];

  public header: PermintaanPembelianHeader = new PermintaanPembelianHeader();
  public details: PermintaanPembelianDetail[] = [];

  // untuk expandable rows
  public keyIn: string = null;
  public isSelect: boolean = false;

  constructor(initial?: Partial<PermintaanPembelianComplete>) {
    Object.assign(this, initial);
  }
}
