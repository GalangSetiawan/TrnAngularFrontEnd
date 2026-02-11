import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, empty } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { AppAlertService } from '../common-components/alert/app-alert.service';

import { StdPagingRequest } from '../common-model/standar-api-request.model';
import { StdResponse, StdErrorResponse } from '../common-model/standar-api-response.model';
import { StdModelMapper } from '../common-class/standar-api-mapper';
import { StdMessageTranslator } from './standar-api-message-translator';
import { StdConstants } from '../common-class/standar-api.constants';

export interface StdConfiguration {
  apiUri: string;
  singleKey: string;
  multiKey?: string;
  apiMessages: Object;
  modelSignature: any;
}

// credits: jun (gmp project)
export class StdService<T> {

  private apiUrl: string = '';

  private config: StdConfiguration;
  private mapper: StdModelMapper<T>;

  constructor(private http: HttpClient, private messageTranslator: StdMessageTranslator, private appAlertService: AppAlertService) { }

  public configure(configuration: StdConfiguration) {

    this.config = configuration;
    if (!this.config.multiKey) {
      this.config.multiKey = this.config.singleKey;
    }

    this.apiUrl = StdConstants.API_ADDRESS + (this.config.apiUri ? '/' + this.config.apiUri : '');
    this.mapper = new StdModelMapper<T>(this.config.modelSignature);
  }

  // credits: https://alligator.io/angular/real-time-search-angular-rxjs/
  public realTimeSearch(searchParamsObs: Observable<{}>, sorts?: {}, paging?: StdPagingRequest, onPreSearch?: Function): Observable<StdResponse<T[]>> {
    return searchParamsObs.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchParams) => {
        if (onPreSearch) { onPreSearch(); }
        return this.search(searchParams, sorts, paging);
      })
    );
  }

  public search(searchParams?: {}, sorts?: {}, paging?: StdPagingRequest): Observable<StdResponse<T[]>> {

    return this.http.get<StdResponse<T[]>>(this.requestUrl('search'), {
      params: this.generateSearchParams(searchParams, sorts, paging)
    }).pipe(
      map(res => this.convertResponse(res, true)),
      catchError(res => this.handleError(res))
      );
  }

  public getList(searchParams?: {}, sorts?: {}, paging?: StdPagingRequest): Observable<StdResponse<T[]>> {

    return this.http.get<StdResponse<T[]>>(this.requestUrl('list'), {
      params: this.generateSearchParams(searchParams, sorts, paging)
    }).pipe(
      map(res => this.convertResponse(res, true)),
      catchError(res => this.handleError(res))
    );
  }

  public get(extraUri: string = '', httpParams?: HttpParams): Observable<StdResponse<T>> {
    return this.http.get<StdResponse<T>>(this.requestUrl(extraUri), { params: httpParams })
      .pipe(
        map(res => this.convertResponse(res)),
        catchError(res => this.handleError(res))
      );
  }

  public post(m: T, extraUri: string = ''): Observable<StdResponse<T>> {
    return this.http.post<StdResponse<T>>(this.requestUrl(extraUri), this.generateRequestBody(m, true))
      .pipe(
        map(res => {
          return this.convertResponse(res);
        }),
        catchError(res => {
          return this.handleError(res);
        })
      );
  }

  public postRaw(m: any, extraUri: string = ''): Observable<StdResponse<T>> {
    return this.http.post<StdResponse<T>>(this.requestUrl(extraUri), m)
      .pipe(
        map(res => this.convertResponse(res)),
        catchError(res => this.handleError(res))
      );
  }

  public postRawResponseMulti(m: any, extraUri: string = ''): Observable<StdResponse<T[]>> {
    return this.http.post<StdResponse<T>>(this.requestUrl(extraUri), m)
      .pipe(
        map(res => this.convertResponse(res, true)),
        catchError(res => this.handleError(res))
      );
  }

  public postRawResponseRaw(m: any, extraUri: string = ''): Observable<StdResponse<any>> {
    return this.http.post<StdResponse<T>>(this.requestUrl(extraUri), m)
      .pipe(
        map(res => this.convertRawResponse(res)),
        catchError(res => this.handleError(res))
      );
  }

  public postRawResponseRawMulti(m: any, extraUri: string = ''): Observable<StdResponse<any>> {
    return this.http.post<StdResponse<T>>(this.requestUrl(extraUri), m)
      .pipe(
        map(res => this.convertRawResponse(res, true)),
        catchError(res => this.handleError(res))
        );
  }

  public put(m: T, extraUri: string = '', requestBodyDepth: number = 0): Observable<StdResponse<T>> {
    return this.http.put<StdResponse<T>>(this.requestUrl(extraUri), this.generateRequestBody(m, true, requestBodyDepth))
      .pipe(
        map(res => this.convertResponse(res)),
        catchError(res => this.handleError(res))
      )
  }

  public deleteByUC(m: T, key: string[], extraUri: string = ''): Observable<StdResponse<T>> {
    let parameter = '?';
    for (const item of key) {
      let isi: string;
      isi = m[item];
      if (parameter === '?') {
        parameter = parameter + item + '=' + m[item].trim();
      } else {
        parameter = parameter + '&' + item + '=' + m[item].trim();
      }
    }

    return this.http.delete<StdResponse<T>>(
      this.apiUrl + parameter).pipe(
      map(res => this.convertResponse(res)),
      catchError(res => this.handleError(res))
    );
  }

  public deleteById(m: T, extraUri: string = ''): Observable<StdResponse<T>> {
    return this.http.delete<StdResponse<T>>(this.requestUrl(extraUri ? extraUri + '/' + m['id'] : m['id']), {
      params: this.generateDeleteParams(m)
    }).pipe(
      map(res => this.convertResponse(res)),
      catchError(res => this.handleError(res))
    );
  }

  public deleteRaw(m: any, extraUri: string = ''): Observable<StdResponse<T>> {
    return this.http.delete<StdResponse<T>>(this.requestUrl(extraUri ? extraUri + '/' + m['id'] : m['id']), {
      params: this.generateDeleteParams(m)
    }).pipe(
      map(res => this.convertResponse(res)),
      catchError(res => this.handleError(res))
    );
  }

  public deleteWithRequestBody(m: T, extraUri: string = ''): Observable<StdResponse<T>> {
    return this.http.request<StdResponse<T>>('delete', this.requestUrl(extraUri), { body: m })
      .pipe(
        map(res => this.convertResponse(res)),
        catchError(res => this.handleError(res))
      );
  }

  public generateSearchParams(searchParams?: {}, sorts?: {}, paging?: StdPagingRequest): HttpParams {
    return this.mapper.toSearchParams(searchParams, sorts, paging);
  }

  public generateRequestBody(m: T, withIdVersion: boolean = true, requestBodyDepth: number = 0): any {
    const requestBody = this.mapper.toJson(m, requestBodyDepth);

    if (!withIdVersion) {
      ['id', 'version'].forEach((k) => { delete (requestBody[k]); });
    }

    return requestBody;
  }

  public generateIdVersionBody(m: T): any {
    const requestBody = {};
    ['id', 'version', 'rootVersion'].forEach((k) => { requestBody[k] = m[k]; });
    return requestBody;
  }

  public generateDeleteParams(m: T): HttpParams {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('version', m['version']);
    if (m['rootId']) { httpParams = httpParams.set('rootId', m['rootId']); }
    if (m['rootVersion']) { httpParams = httpParams.set('rootVersion', m['rootVersion']); }

    return httpParams;
  }

  private convertResponse(responseBody: StdResponse<any>, isMulti: boolean = false): StdResponse<any> {

    responseBody.data = isMulti
      ? this.mapper.toModelArray(responseBody.data[this.config.multiKey])
      : this.mapper.toModel(responseBody.data[this.config.singleKey]);

    this.messageTranslator.translateApiResponse(responseBody, this.config.apiMessages);

    return responseBody;
  }

  private convertRawResponse(responseBody: StdResponse<any>, isMulti: boolean = false): StdResponse<any> {

    responseBody.data = isMulti
      ? responseBody.data[this.config.multiKey]
      : responseBody.data[this.config.singleKey];

    this.messageTranslator.translateApiResponse(responseBody, this.config.apiMessages);

    return responseBody;
  }

  private handleError(err: any): Observable<StdErrorResponse> {

    if (err.error instanceof Error) {
      console.error('[DaService] client-side error occured =>', err);
      this.appAlertService.error('Client-side error occurred', err);
      return empty();
    }
    else if (err.status == null) {
      console.error('[DaService] client-side error occured =>', err);
      this.appAlertService.error('Client-side error occurred', err);
      return empty();
    }
    else {

      if (err.status === 0) {
        this.appAlertService.error('Unable to connect to data server', err);
        return empty();
      }
      else {
        const daError: StdErrorResponse = err.error;
        if (daError.errors) {
          this.messageTranslator.translateErrorResponse(daError, this.config.apiMessages);

          let isBusinessError = false;
          for (const error of daError.errors) {
            if (this.config.apiMessages[error.code]) { isBusinessError = true; break; }
          }

          if (isBusinessError) { return Observable.throw(daError); }
          else {
            err.error = daError;
            this.appAlertService.error(daError.feErrors[0], err);
            return empty();
          }
        }
        else {
          this.appAlertService.error('Server-side error occurred', err.error);
          return empty();
        }
      }
    }
  }

  private requestUrl(extraUri?: string): string {
    return this.apiUrl + (extraUri ? '/' + extraUri : '');
  }
}

@Injectable()
export class StdServiceFactory<T> {
  constructor(private http: HttpClient, private messageTranslator: StdMessageTranslator, private appAlertService: AppAlertService) { }

  public assemble(conf: StdConfiguration) {
    const service = new StdService<T>(this.http, this.messageTranslator, this.appAlertService);
    service.configure(conf);

    return service;
  }
}
