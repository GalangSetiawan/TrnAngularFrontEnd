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

import { MasterBagian } from './model/bagian.model';

@Injectable()
export class MasterBagianService extends BaseService {

  private apiUrl = StdConstants.API_ADDRESS + '/api/bagian';

  private singleKey = 'item';
  private multiKey = 'items';
  private apiMessages = '';

  private mapperBagian: StdModelMapper<MasterBagian> =
    new StdModelMapper<MasterBagian>(MasterBagian);

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
    searchParams?: BagianSearchParams,
    sorts?: BagianSorts,
    paging?: StdPagingRequest
  ): Observable<StdResponse<MasterBagian[]>> {

    return this.http.get<StdResponse<MasterBagian[]>>(
      this.requestUrl('search'),
      {
        params: this.mapperBagian.toSearchParams(searchParams, sorts, paging)
      }
    ).pipe(
      map(res => this.convertResponse(res, this.mapperBagian, true)),
      catchError(res => this.handleError(
        res,
        this.appAlertService,
        this.defaultLanguageState,
        this.router,
        this.messageTranslator
      ))
    );
  }

  public add(model: MasterBagian): Observable<MasterBagian> {
    return this.http.post<StdResponse<MasterBagian>>(
      this.apiUrl,
      this.mapperBagian.toJson(model, 0)
    ).pipe(
      map((res: StdResponse<MasterBagian>) => {
        return this.convertResponse(res, this.mapperBagian).data;
      }),
      catchError((res: StdResponse<MasterBagian>) => {
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

  public edit(model: MasterBagian): Observable<MasterBagian> {
    return this.http.put<StdResponse<MasterBagian>>(
      this.apiUrl,
      this.mapperBagian.toJson(model, 0)
    ).pipe(
      map((res: StdResponse<MasterBagian>) => {
        return this.convertResponse(res, this.mapperBagian).data;
      }),
      catchError((res: StdResponse<MasterBagian>) => {
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

  public delete(model: MasterBagian): Observable<boolean> {
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
   * Get by nama bagian (active only, for autocomplete verification)
   * GET /api/bagian/get-by-nama?namaBagian=Produksi
   */
  public getByNama(namaBagian: string): Observable<StdResponse<MasterBagian>> {
    return this.http.get<StdResponse<MasterBagian>>(this.requestUrl('get-by-nama'), {
      params: (new HttpParams()).set('namaBagian', namaBagian)
    }).pipe(
      map((res: StdResponse<MasterBagian>) => {
        const tmp = this.convertResponse(res, this.mapperBagian);
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

export interface BagianSearchParams {
  kodeBagian?: string;
  namaBagian?: string;
  aktif?: string;
}

export interface BagianSorts {
  kodeBagian?: SortMode;
  namaBagian?: SortMode;
}
