import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { BaseService } from 'src/app/common/common-class/base-service';
import { StdModelMapper } from 'src/app/common/common-class/standar-api-mapper';
import { StdConstants } from 'src/app/common/common-class/standar-api.constants';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { SortMode, StdPagingRequest } from 'src/app/common/common-model/standar-api-request.model';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { StdMessageTranslator } from 'src/app/common/common-services/standar-api-message-translator';
import { Customer } from './model/customer.model';


@Injectable()
export class CustomerService extends BaseService {

  private apiUrl = StdConstants.API_ADDRESS + '/api/customer';

  private singleKey = 'item';
  private multiKey = 'items';
  private apiMessages = '';

  private mapperCustomer:
    StdModelMapper<Customer> = new StdModelMapper<Customer>(Customer);

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
    searchParams?: CustomerSearchParams,
    sorts?: CustomerSorts,
    paging?: StdPagingRequest): Observable<StdResponse<Customer[]>> {

    return this.http.get<StdResponse<Customer[]>>(this.requestUrl('search'), {
        params: this.mapperCustomer.toSearchParams(searchParams, sorts, paging) 
      }).pipe(
        map(res => this.convertResponse(res, this.mapperCustomer, true)),
        catchError(res => this.handleError(res, this.appAlertService, this.defaultLanguageState, this.router, this.messageTranslator))
        );
  }

  private requestUrl(extraUri?: string): string {
    return this.apiUrl + (extraUri ? '/' + extraUri : '');
  }

  public add(model: Customer): Observable<Customer> {
    return this.http.post<StdResponse<Customer>>(this.apiUrl,
      this.mapperCustomer.toJson(model, 0))
      .pipe(
        map((res: StdResponse<Customer>) => {
          return this.convertResponse(res, this.mapperCustomer).data;
        }),
        catchError((res: StdResponse<Customer>) => {
          return this.handleError(res, this.appAlertService, this.defaultLanguageState, this.router, this.messageTranslator);
        })
      );
  }

  public edit(model: Customer): Observable<Customer> {
    return this.http.put<StdResponse<Customer>>(this.apiUrl,
      this.mapperCustomer.toJson(model, 0))
      .pipe(
        map((res: StdResponse<Customer>) => {
          return this.convertResponse(res, this.mapperCustomer).data;
        }),
        catchError((res: StdResponse<Customer>) => {
          return this.handleError(res, this.appAlertService, this.defaultLanguageState, this.router, this.messageTranslator);
        })
      );
  }

  public delete(model: Customer): Observable<boolean> {

    return this.http.delete<StdResponse<string>>(this.apiUrl, {
      params: (new HttpParams()).set('id', model.id)
                                .set('version', model.version.toString())
    }).pipe(
      map(res => {return true;}),
      catchError(res => this.handleError(res, this.appAlertService, this.defaultLanguageState, this.router, this.messageTranslator))
    );
  }

  public get(model: Customer): Observable<StdResponse<Customer>> {

    return this.http.get<StdResponse<Customer>>(this.apiUrl, {
      params: (new HttpParams()).set('nama', model.nama)
    }).pipe(
      map((res: StdResponse<Customer>) => {
        let tmp = this.convertResponse(res, this.mapperCustomer);
        return tmp;
      }),
      catchError(res => this.handleError(res, this.appAlertService, this.defaultLanguageState, this.router, this.messageTranslator))
    );
  }

  public getByNama(nama: string): Observable<StdResponse<Customer>> {

    return this.http.get<StdResponse<Customer>>(this.requestUrl('get-by-nama'), {
      params: (new HttpParams()).set('nama', nama)
    }).pipe(
      map((res: StdResponse<Customer>) => {
        const tmp = this.convertResponse(res, this.mapperCustomer);

        return tmp;
      }),
      catchError(res => this.handleError(res, this.appAlertService, this.defaultLanguageState, this.router, this.messageTranslator))
    );
  }

}
export interface CustomerSearchParams {
  nama?: string;
  picnama?: string;
  picalamat?: string;
  picemail?: string;
  billnama?: string;
  billalamat?: string;
  billemail?: string;
  billcust2?: string;
  billnama2?: string;
  flakt?: string;
}

export interface CustomerSorts {
  nama?: SortMode;
  picnama?: SortMode;
  picalamat?: SortMode;
  picemail?: SortMode;
  billnama?: SortMode;
  billalamat?: SortMode;
  billemail?: SortMode;
  billcust2?: SortMode;
  billnama2?: SortMode;
}

