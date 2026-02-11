import { Injectable } from '@angular/core';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
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

import { ComboConstants } from './model/combo.constants.model';

@Injectable()
export class ComboConstantsService extends BaseService {

  private apiUrl = StdConstants.API_ADDRESS + '/api/combo-constants';

  private singleKey = 'item';
  private multiKey = 'items';
  private apiMessages = '';

  private mapperComboConstants:
    StdModelMapper<ComboConstants> = new StdModelMapper<ComboConstants>(ComboConstants);

  constructor(private http: HttpClient, 
              private messageTranslator: StdMessageTranslator,
              private defaultLanguageState: DefaultLanguageState,
              private router: Router,
              private appAlertService: AppAlertService) {

    super();

  }

  private convertResponse(responseBody: StdResponse<any>, mapper: any, isMulti: boolean = false): StdResponse<any> {

    responseBody.data = isMulti
      ? mapper.toModelArray(responseBody.data[this.multiKey])
      : mapper.toModel(responseBody.data[this.singleKey]);

    this.messageTranslator.translateApiResponse(responseBody, this.apiMessages);

    return responseBody;
  }

  public search(
    searchParams?: ComboConstantsSearchParams,
    sorts?: ComboConstantsSorts,
    paging?: StdPagingRequest): Observable<StdResponse<ComboConstants[]>> {

    return this.http.get<StdResponse<ComboConstants[]>>(this.requestUrl('search'), {
        params: this.generateSearchParams(searchParams, sorts, paging)
      }).pipe(
        map(res => this.convertResponse(res, this.mapperComboConstants, true)),
        catchError(res => this.handleError(res, this.appAlertService, this.defaultLanguageState, this.router, this.messageTranslator))
        );
  }

  private requestUrl(extraUri?: string): string {
    return this.apiUrl + (extraUri ? '/' + extraUri : '');
  }

  public generateSearchParams(searchParams?: {}, sorts?: {}, paging?: StdPagingRequest): HttpParams {
    return this.mapperComboConstants.toSearchParams(searchParams, sorts, paging);
  }

  public getKompNoOtomatisExcludeCounter(): Observable<ComboConstants[]> {

    return this.http.get<StdResponse<ComboConstants[]>>(this.requestUrl('komp-nomor-otomatis-excl-counter')).pipe(
        map(res => this.convertResponse(res, this.mapperComboConstants, true).data),
        catchError(res => this.handleError(res, this.appAlertService, this.defaultLanguageState, this.router, this.messageTranslator))
      );
  }

}
export interface ComboConstantsSearchParams {
  rectyp?: string;
  reccode?: string;
  rectxt?: string;
}

export interface ComboConstantsSorts {
  rectyp?: SortMode;
  reccode?: SortMode;
  rectxt?: SortMode;
}

