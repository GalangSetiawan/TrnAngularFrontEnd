import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';

@Injectable()
export class GlComboConstantService {

  constructor() {
  }

  getDebetKredit(): Observable<StdResponse<any[]>> {
    const result = {data: [{id: '1', kode: 'D', deskripsi: 'Debet'}, {id: '2', kode: 'K', deskripsi: 'Kredit'}]};
    return of(result);
  }

  getJenisRefDokPenerimaanKasBank(): Observable<StdResponse<any[]>> {
    const result = {data: [{id: '1', kode: 'Jual', deskripsi: 'Jual'},
                           {id: '2', kode: 'ReturJual', deskripsi: 'Retur Jual'},
                           {id: '3', kode: 'ReturBeli', deskripsi: 'Retur Beli'}]};
    return of(result);
  }

  getPlusMinus(): Observable<StdResponse<any[]>> {
    const result = {data: [{id: '1', kode: '+', deskripsi: 'Tambah'},
                           {id: '2', kode: '-', deskripsi: 'Kurang'},]};
    return of(result);
  }

  getPeriodeJadwal(): Observable<StdResponse<any[]>> {
    const result = {data: [{id: '1', kode: 'M', deskripsi: 'Minggu'},
                           {id: '2', kode: 'B', deskripsi: 'Bulan'},
                           {id: '2', kode: 'T', deskripsi: 'Tahun'},]};
    return of(result);
  }
}
