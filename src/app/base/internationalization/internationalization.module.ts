import { NgModule } from '@angular/core';

import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';

import { InternationalizationCustomLoader } from './internationalization-custom-loader';
import { AppMissingTranslationHandler } from './missing-translation-handler';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: InternationalizationCustomLoader
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: AppMissingTranslationHandler }
    })
  ],
  exports: [
    TranslateModule
  ]
})
export class InternationalizationModule { }
