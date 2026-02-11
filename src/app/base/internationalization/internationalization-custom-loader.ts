import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { Translation } from './i18n/translation';

@Injectable()
export class InternationalizationCustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const translation = Translation.getTranslation(lang);
    return of(translation);
  }
}
