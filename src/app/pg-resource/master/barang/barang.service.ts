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
import { Router } from '@angular/router';

import { MasterBarang } from './model/barang.model';

@Injectable()
export class MasterBarangService extends BaseService {

  private apiUrl = StdConstants.API_ADDRESS + '/api/barang';

  private singleKey = 'item';
  private multiKey = 'items';
  private apiMessages = '';

  private mapperBarang: StdModelMapper<MasterBarang> =
    new StdModelMapper<MasterBarang>(MasterBarang);

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

  public search(
    searchParams?: BarangSearchParams,
    sorts?: BarangSorts,
    paging?: StdPagingRequest
  ): Observable<StdResponse<MasterBarang[]>> {

    return this.http.get<StdResponse<MasterBarang[]>>(
      this.requestUrl('search'),
      {
        params: this.mapperBarang.toSearchParams(searchParams, sorts, paging)
      }
    ).pipe(
      map(res => this.convertResponse(res, this.mapperBarang, true)),
      catchError(res => this.handleError(
        res,
        this.appAlertService,
        this.defaultLanguageState,
        this.router,
        this.messageTranslator
      ))
    );
  }

  public add(model: MasterBarang): Observable<MasterBarang> {
    return this.http.post<StdResponse<MasterBarang>>(
      this.apiUrl,
      this.mapperBarang.toJson(model, 0)
    ).pipe(
      map((res: StdResponse<MasterBarang>) => {
        return this.convertResponse(res, this.mapperBarang).data;
      }),
      catchError((res: StdResponse<MasterBarang>) => {
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

  public edit(model: MasterBarang): Observable<MasterBarang> {
    return this.http.put<StdResponse<MasterBarang>>(
      this.apiUrl,
      this.mapperBarang.toJson(model, 0)
    ).pipe(
      map((res: StdResponse<MasterBarang>) => {
        return this.convertResponse(res, this.mapperBarang).data;
      }),
      catchError((res: StdResponse<MasterBarang>) => {
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

  public delete(model: MasterBarang): Observable<boolean> {
    return this.http.delete<StdResponse<string>>(this.apiUrl, {
      params: (new HttpParams())
        .set('id', model.id)
        .set('version', model.version.toString())
    }).pipe(
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

  /**
   * Get by nama barang (active only, for autocomplete verification)
   * GET /api/barang/get-by-nama?namaBarang=Pensil
   */
  public getByNama(namaBarang: string): Observable<StdResponse<MasterBarang>> {
    return this.http.get<StdResponse<MasterBarang>>(this.requestUrl('get-by-nama'), {
      params: (new HttpParams()).set('namaBarang', namaBarang)
    }).pipe(
      map((res: StdResponse<MasterBarang>) => {
        const tmp = this.convertResponse(res, this.mapperBarang);
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
}

export interface BarangSearchParams {
  kodeBarang?: string;
  namaBarang?: string;
  aktif?: string;
}

export interface BarangSorts {
  kodeBarang?: SortMode;
  namaBarang?: SortMode;
}
