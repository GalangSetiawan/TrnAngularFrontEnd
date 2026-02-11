import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DefaultLanguageState } from './base/default-language/default-language.state';
import { Language, LanguageTypes } from './base/default-language/language';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public languageList: Language[] = LanguageTypes.getValues();
    public defaultLanguage: Language = null;

    constructor(
        private translateService: TranslateService,
        private languageState: DefaultLanguageState,
    ) {
        this.initLanguageState();
    }

    ngOnInit() {
    }

    public initLanguageState() {
        this.languageList = LanguageTypes.getValues();
        this.defaultLanguage = this.languageState.getDefaultLanguage();
        this.translateService.use(this.defaultLanguage.value);
      }

}
