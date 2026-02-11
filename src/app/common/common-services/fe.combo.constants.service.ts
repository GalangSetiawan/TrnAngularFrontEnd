import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { StdResponse } from '../common-model/standar-api-response.model';
import { ComboConstant } from '../common-model/comboconstant.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class FEComboConstantService {

  public selected = null;

  constructor(private translateService: TranslateService,
             ) {
  }

  getYaTidak(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: 'Y', deskripsi: 'Ya'},
      {id: '2', kode: 'T', deskripsi: 'Tidak'}]};
    return of(result);
  }

  getKelompokLabaRugi(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: 'C', deskripsi: 'Pendapatan'},
      {id: '2', kode: 'D', deskripsi: 'Biaya'}]};
    return of(result);
  }

  getFilterAktif(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: '', deskripsi: 'Semua'},
      {id: '2', kode: 'T', deskripsi: 'NonAktif'},
      {id: '3', kode: 'Y', deskripsi: 'Aktif'},
    ]};
    return of(result);
  }

  getAktifNonAktif(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: 'T', deskripsi: 'NonAktif'},
      {id: '2', kode: 'Y', deskripsi: 'Aktif'},
    ]};
    return of(result);
  }

  getStatusKonfirmasi(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: '', deskripsi: 'Semua'},
      {id: '2', kode: 'T', deskripsi: 'Belum'},
      {id: '3', kode: 'Y', deskripsi: 'Sudah'},
    ]};
    return of(result);
  }

  getBahasa(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: 'id', deskripsi: 'Indonesia'},
      {id: '2', kode: 'en', deskripsi: 'English'}]};
    return of(result);
  }

  getFormatAngka(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: 'id-ID', deskripsi: '123.456,78'},
      {id: '2', kode: 'en-US', deskripsi: '123,456.78'}]};
    return of(result);
  }

  getOtomatisManual(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: 'Y', deskripsi: 'Otomatis'},
      {id: '2', kode: 'T', deskripsi: 'Manual'}]};
    return of(result);
  }

  getTahunanBulanan(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: 'T', deskripsi: 'Tahunan'},
      {id: '2', kode: 'B', deskripsi: 'Bulanan'}]};
    return of(result);
  }

  getDebetKredit(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: 'D', deskripsi: 'Debet'},
      {id: '2', kode: 'K', deskripsi: 'Kredit'}]};
    return of(result);
  }

  getSkalaPerusahaan(): Observable<StdResponse<ComboConstant[]>> {
    const result = {data: [
      {id: '1', kode: '1', deskripsi: 'Perorangan'},
      {id: '2', kode: '2', deskripsi: 'Perusahaan'}]};
    return of(result);
  }

  getBulan(): any[]{

    const hasil:any[] = [];

    this.translateService.get('januari')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 1 }));
    });
    this.translateService.get('pebruari')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 2 }));
    });
    this.translateService.get('maret')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 3 }));
    });
    this.translateService.get('april')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 4 }));
    });
    this.translateService.get('mei')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 5 }));
    });
    this.translateService.get('juni')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 6 }));
    });
    this.translateService.get('juli')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 7 }));
    });
    this.translateService.get('agustus')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 8 }));
    });
    this.translateService.get('september')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 9 }));
    });
    this.translateService.get('oktober')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 10 }));
    });
    this.translateService.get('november')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 11 }));
    });
    this.translateService.get('desember')
    .subscribe((translation) => {
      hasil.push(new Object({label: translation, value: 12 }));
    });

    return hasil;
  }
}
