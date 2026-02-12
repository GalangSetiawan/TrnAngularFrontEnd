import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BaseService } from 'src/app/common/common-class/base-service';
import { SortMode, StdPagingRequest } from 'src/app/common/common-model/standar-api-request.model';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { StdConstants } from 'src/app/common/common-class/standar-api.constants';
import { StdModelMapper } from 'src/app/common/common-class/standar-api-mapper';
import { StdMessageTranslator } from 'src/app/common/common-services/standar-api-message-translator';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { LanguageTypes } from 'src/app/base/default-language/language';
import { IndonesiaMessageDictionary } from 'src/app/base/internationalization/i18n/indonesia-message.translation';
import { EnglishMessageDictionary } from 'src/app/base/internationalization/i18n/english-message.translation';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

import { PermintaanPembelianHeader } from './model/permintaan-pembelian-header.model';
import { PermintaanPembelianDetail } from './model/permintaan-pembelian-detail.model';
import { PermintaanPembelianComplete } from './model/permintaan-pembelian-complete.model';

@Injectable()
export class PermintaanPembelianService extends BaseService {

  private apiUrl = StdConstants.API_ADDRESS + '/api/permintaan-pembelian';

  private singleKey = 'item';
  private multiKey = 'items';
  private apiMessages = '';

  private mapperHeader:
    StdModelMapper<PermintaanPembelianHeader> =
    new StdModelMapper<PermintaanPembelianHeader>(PermintaanPembelianHeader);

  private mapperComplete:
    StdModelMapper<PermintaanPembelianComplete> =
    new StdModelMapper<PermintaanPembelianComplete>(PermintaanPembelianComplete);

  private mapperDetail:
    StdModelMapper<PermintaanPembelianDetail> =
    new StdModelMapper<PermintaanPembelianDetail>(PermintaanPembelianDetail);

  constructor(
    private http: HttpClient,
    private messageTranslator: StdMessageTranslator,
    private defaultLanguageState: DefaultLanguageState,
    private router: Router,
    private appAlertService: AppAlertService
  ) {
    super();
  }

  private convertResponse(
    responseBody: StdResponse<any>,
    mapper: any,
    isMulti: boolean = false
  ): StdResponse<any> {
    responseBody.data = isMulti
      ? mapper.toModelArray(responseBody.data[this.multiKey])
      : mapper.toModel(responseBody.data[this.singleKey]);

    this.messageTranslator.translateApiResponse(responseBody, this.apiMessages);
    return responseBody;
  }

  private requestUrl(extraUri?: string): string {
    return this.apiUrl + (extraUri ? '/' + extraUri : '');
  }

  // Backend tidak punya /search endpoint, gunakan getAll() sebagai gantinya
  public search(
    searchParams?: PermintaanPembelianSearchParams,
    sorts?: PermintaanPembelianSorts,
    paging?: StdPagingRequest
  ): Observable<StdResponse<PermintaanPembelianHeader[]>> {

    // Backend hanya ada GET /api/permintaan-pembelian (get all)
    // Untuk filter by tanggal, gunakan getByTanggal() method
    return this.http.get<StdResponse<PermintaanPembelianHeader[]>>(
      this.apiUrl
    ).pipe(
      map(res => this.convertResponse(res, this.mapperHeader, true)),
      catchError(res => this.handleError(
        res,
        this.appAlertService,
        this.defaultLanguageState,
        this.router,
        this.messageTranslator
      ))
    );
  }

  public getByTanggal(tanggal: string): Observable<StdResponse<PermintaanPembelianHeader[]>> {
    return this.http.get<StdResponse<PermintaanPembelianHeader[]>>(
      this.requestUrl('by-tanggal'),
      {
        params: (new HttpParams()).set('tanggal', tanggal)
      }
    ).pipe(
      map(res => this.convertResponse(res, this.mapperHeader, true)),
      catchError(res => this.handleError(
        res,
        this.appAlertService,
        this.defaultLanguageState,
        this.router,
        this.messageTranslator
      ))
    );
  }

  // Backend: GET /api/permintaan-pembelian/{id}
  public get(model: PermintaanPembelianHeader): Observable<StdResponse<PermintaanPembelianComplete>> {
    return this.http.get<StdResponse<PermintaanPembelianComplete>>(
      `${this.apiUrl}/${model.id}`
    ).pipe(
      map((res: StdResponse<PermintaanPembelianComplete>) => {
        let tmp = this.convertResponse(res, this.mapperComplete);

        if (tmp.data.details !== undefined) {
          tmp.data.details = this.mapperDetail.toModelArray(tmp.data.details);

          // PENTING: Beri keyIn untuk setiap detail untuk grid handling
          for (let item of tmp.data.details) {
            item.keyIn = uuidv4();
          }
        }

        return tmp;
      }),
      catchError(res => this.handleError(
        res,
        this.appAlertService,
        this.defaultLanguageState,
        this.router,
        this.messageTranslator
      ))
    );
  }

  public add(model: PermintaanPembelianComplete): Observable<PermintaanPembelianComplete> {
    return this.http.post<StdResponse<PermintaanPembelianComplete>>(
      this.apiUrl,
      this.mapperComplete.toJson(model, 2)
    ).pipe(
      map((res: StdResponse<PermintaanPembelianComplete>) => {
        return this.convertResponse(res, this.mapperComplete).data;
      }),
      catchError((res: StdResponse<PermintaanPembelianComplete>) => {
        return this.handleError(
          res,
          this.appAlertService,
          this.defaultLanguageState,
          this.router,
          this.messageTranslator
        );
      })
    );
  }

  // Backend: PUT /api/permintaan-pembelian/{id}
  public edit(model: PermintaanPembelianComplete): Observable<PermintaanPembelianComplete> {
    return this.http.put<StdResponse<PermintaanPembelianComplete>>(
      `${this.apiUrl}/${model.header.id}`,
      this.mapperComplete.toJson(model, 2)
    ).pipe(
      map((res: StdResponse<PermintaanPembelianComplete>) => {
        return this.convertResponse(res, this.mapperComplete).data;
      }),
      catchError((res: StdResponse<PermintaanPembelianComplete>) => {
        return this.handleError(
          res,
          this.appAlertService,
          this.defaultLanguageState,
          this.router,
          this.messageTranslator
        );
      })
    );
  }

  // Backend: DELETE /api/permintaan-pembelian/{id}?version=...
  public delete(model: PermintaanPembelianHeader): Observable<boolean> {
    return this.http.delete<StdResponse<string>>(
      `${this.apiUrl}/${model.id}`,
      {
        params: (new HttpParams()).set('version', model.version.toString())
      }
    ).pipe(
      map(res => { return true; }),
      catchError(res => this.handleError(
        res,
        this.appAlertService,
        this.defaultLanguageState,
        this.router,
        this.messageTranslator
      ))
    );
  }

  // Method untuk handle error response dengan detail grid errors
  public convertResponseComplete(responseBody: StdResponse<any>): StdResponse<any> {
    responseBody.data = this.mapperComplete.toModel(responseBody.data[this.singleKey]);

    if (responseBody.data) {
      if (responseBody.data.details !== undefined) {
        responseBody.data.details = this.mapperDetail.toModelArray(responseBody.data.details);
      }
    }

    return responseBody;
  }

  // Method untuk translate error messages di grid
  public translateInGridError(data: any) {
    if (data) {
      for (const itemdetails of data.details) {
        if (itemdetails.errorMsg) {
          for (const errorMsg of itemdetails.errorMsg) {
            this.errorGridMessageTranslation(errorMsg);
          }
        }
      }
    }
  }

  private errorGridMessageTranslation(errorMsg: any) {
    if (this.defaultLanguageState.getDefaultLanguage().value === LanguageTypes.indonesia.value) {
      errorMsg.desc = this.messageTranslator.translateLooseMessage(
        errorMsg,
        IndonesiaMessageDictionary.getValues()
      );
    } else if (this.defaultLanguageState.getDefaultLanguage().value === LanguageTypes.english.value) {
      errorMsg.desc = this.messageTranslator.translateLooseMessage(
        errorMsg,
        EnglishMessageDictionary.getValues()
      );
    }
  }
}

export interface PermintaanPembelianSearchParams {
  nomor?: string;
  bagian?: string;
  tanggal?: Date;
  keterangan?: string;
}

export interface PermintaanPembelianSorts {
  nomor?: SortMode;
  tanggal?: SortMode;
  bagian?: SortMode;
}
