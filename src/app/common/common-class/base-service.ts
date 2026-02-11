import { StdErrorResponse, StdResponse } from '../common-model/standar-api-response.model';
import { Observable, empty, EMPTY, throwError } from 'rxjs';
import { AppAlertService } from '../common-components/alert/app-alert.service';
import { StdMessageTranslator } from '../common-services/standar-api-message-translator';
import { LanguageTypes } from 'src/app/base/default-language/language';
import { IndonesiaMessageDictionary } from 'src/app/base/internationalization/i18n/indonesia-message.translation';
import { EnglishMessageDictionary } from 'src/app/base/internationalization/i18n/english-message.translation';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { Router } from '@angular/router';

export class BaseService {

    public handleError(err: any,
                       appAlertService: AppAlertService,
                       defaultLanguageState: DefaultLanguageState,
                       router: Router,
                       messageTranslator: StdMessageTranslator): Observable<StdErrorResponse> |
                                                                 Observable<StdErrorResponse[]> |
                                                                 Observable<any> |
                                                                 Observable<any[]> {

        // this.uiBlockService.clearUiBlock();

        if (err.error instanceof Error) {
          console.error('1. [DaService] client-side error occured =>', err);
          // appAlertService.instantError('server.error.title', 'server.error.desc');
          appAlertService.error({code: 'server.error.title', desc: ''});
          return EMPTY;
        } else if (err.status == null) {
          console.error('2. [DaService] client-side error occured =>', err);
          //appAlertService.instantError('server.error.title', 'server.error.desc');
          appAlertService.error({code: 'server.error.title', desc: ''});
          return EMPTY;
        } else {
          if (err.status === 0) {
            console.error('3. [DaService] client-side error occured =>', err);
            // this.dialog.closeAll();
            //appAlertService.instantError('client.nointernet.title', 'client.nointernet.desc');
            appAlertService.error({code: 'client.nointernet.title', desc: ''});
            return EMPTY;
          } else if (err.status === 401) {
            const gaError: StdErrorResponse = err.error;
            if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.indonesia.value) {
              messageTranslator.translateApiResponse(gaError, IndonesiaMessageDictionary.getValues());
            } else if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.english.value) {
              messageTranslator.translateApiResponse(gaError, EnglishMessageDictionary.getValues());
            }
            err.error = gaError;

            // To Do : Change it with popup error later
            //appAlertService.instantError('client.expired.title', 'client.expired.desc');
            appAlertService.error({code: 'client.expired.title', desc: ''});
            router.navigate(['/login']);
            return EMPTY;
          } else {
            const gaError: StdErrorResponse = err.error;
            if (gaError instanceof Array) {
              const gaResponses = gaError as StdResponse<any>[];
              for (const gaResponse of gaResponses) {
                if (gaResponse.errors) {
                  if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.indonesia.value) {
                    messageTranslator.translateApiResponse(gaResponse, IndonesiaMessageDictionary.getValues());
                  } else if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.english.value) {
                    messageTranslator.translateApiResponse(gaResponse, EnglishMessageDictionary.getValues());
                  }
                } else {
                  //   this.dialog.closeAll();
                  // appAlertService.instantError('server.error.title', 'server.error.desc');
                  // appAlertService.instantError('Server Error', 'server.error.desc');
                  appAlertService.error({code: 'server.error.desc', desc: ''});
                  return EMPTY;
                }
              }
              return throwError(gaResponses);
            } else {
              if (gaError.errors && gaError.errors.length > 0) {
                if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.indonesia.value) {
                  messageTranslator.translateApiResponse(gaError, IndonesiaMessageDictionary.getValues().contents);
                } else if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.english.value) {
                  messageTranslator.translateApiResponse(gaError, EnglishMessageDictionary.getValues().contents);
                }

                let isBusinessError = false;
                for (const error of gaError.errors) {
                  // Use indonesian or english dictionary to check is business error
                  if (IndonesiaMessageDictionary.getValues().contents[error.code]) { isBusinessError = true; break; }
                }

                if (isBusinessError) {
                  return throwError(gaError);
                } else {
                  err.error = gaError;
                  console.error('4. [DaService] server-side error occured =>', err);
                  // this.dialog.closeAll();
                  // appAlertService.instantError('server.error.title', 'server.error.desc');
                  // appAlertService.instantError('Server Error', 'server.error.desc');
                  appAlertService.error({code: 'server.error.desc', desc: ''});
                  return EMPTY;
                }
              } else if (gaError.multiErrors && gaError.multiErrors.length > 0) {
                if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.indonesia.value) {
                  messageTranslator.translateApiResponse(gaError, IndonesiaMessageDictionary.getValues().contents);
                } else if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.english.value) {
                  messageTranslator.translateApiResponse(gaError, EnglishMessageDictionary.getValues().contents);
                }

                let isBusinessError = false;
                for (const multiError of gaError.multiErrors) {
                  for (const multiMessages of multiError.messages) {
                    for (const message of multiMessages) {
                      if (IndonesiaMessageDictionary.getValues().contents[message.code]) { isBusinessError = true; break; }
                    }
                  }
                }

                if (isBusinessError) {
                  return throwError(gaError);
                } else {
                  err.error = gaError;
                  console.error('4. [DaService] server-side error occured x =>', err);
                  // this.dialog.closeAll();
                  // appAlertService.instantError('server.error.title', 'server.error.desc');
                  //appAlertService.instantError('Server Error', 'server.error.desc');
                  appAlertService.error({code: 'server.error.desc', desc: ''});
                  return EMPTY;
                }
              } else {
                // this.dialog.closeAll();
                // appAlertService.instantError('server.error.title', 'server.error.desc');
                //appAlertService.instantError('Server Error', 'server.error.desc');
                appAlertService.error({code: 'server.error.desc', desc: ''});
                return EMPTY;
              }
            }
          }
        }
      }

    public getMessageFromDictionary(defaultLanguageState: DefaultLanguageState, messageCode: string) {

      let message = null;
      if (defaultLanguageState.getDefaultLanguage().value === LanguageTypes.indonesia.value) {

        message = IndonesiaMessageDictionary.getValues()[messageCode];
      } else {

        message = EnglishMessageDictionary.getValues()[messageCode];
      }

      if (!message) {
        message = messageCode;
      }

      return message;
    }

}
