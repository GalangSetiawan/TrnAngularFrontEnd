import { Injectable } from '@angular/core';

import { StdPagingRequest } from 'src/app/common/common-model/standar-api-request.model';
import { StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StdConstants } from 'src/app/common/common-class/standar-api.constants';
import { StdModelMapper } from 'src/app/common/common-class/standar-api-mapper';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { StdMessageTranslator } from 'src/app/common/common-services/standar-api-message-translator';
import { BEComboConstant } from '../common-model/be.combo.constant.model';
import { BaseService } from '../common-class/base-service';
import { Router } from '@angular/router';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';

@Injectable()
export class BEComboConstantService extends BaseService {

  private apiUrl = StdConstants.API_ADDRESS + '/' + 'api/comboconstant/defaultstatussubkelompokbarang';

  private singleKey = 'defaultStatusSubKelompokBarang';
  private multiKey = 'defaultStatusSubKelompokBarangs';
  private apiMessages = '';

  private mapperBEComboConstant: StdModelMapper<BEComboConstant> = new StdModelMapper<BEComboConstant>(BEComboConstant);

  constructor(private http: HttpClient,
              private defaultLanguageState: DefaultLanguageState,  // language
              private router: Router, // language
              private messageTranslator: StdMessageTranslator,
              private appAlertService: AppAlertService) {
    super();
  }

  public getDefaultStatusSubKelompokBarang(searchParams?: {},
                                           sorts?: {},
                                           paging?: StdPagingRequest): Observable<StdResponse<BEComboConstant[]>> {

    return this.http.get<StdResponse<BEComboConstant[]>>(this.requestUrl('list'), {
      params: this.generateSearchParams(searchParams, sorts, paging)
    }).pipe(
      map(res => this.convertResponse(res, this.mapperBEComboConstant, true)),
      catchError(res => this.handleError(res, this.appAlertService, this.defaultLanguageState,
        this.router, this.messageTranslator))
    );
  }

  private requestUrl(extraUri?: string): string {
    return this.apiUrl + (extraUri ? '/' + extraUri : '');
  }

  public generateSearchParams(searchParams?: {}, sorts?: {}, paging?: StdPagingRequest): HttpParams {
    return this.mapperBEComboConstant.toSearchParams(searchParams, sorts, paging);
  }

  private convertResponse(responseBody: StdResponse<any>, mapper: any, isMulti: boolean = false): StdResponse<any> {

    responseBody.data = isMulti
      ? mapper.toModelArray(responseBody.data[this.multiKey])
      : mapper.toModel(responseBody.data[this.singleKey]);

    this.messageTranslator.translateApiResponse(responseBody, this.apiMessages);

    return responseBody;
  }

}
