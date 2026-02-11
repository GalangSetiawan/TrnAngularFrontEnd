import { Component, OnInit } from '@angular/core';
import { MainAppComponent } from '../../main-app.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Language, LanguageTypes } from 'src/app/base/default-language/language';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { TranslateService } from '@ngx-translate/core';
import { BreadCrumbService } from 'src/app/common/common-components/breadcrumb/breadcrumb.service';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  providers: [DialogService],
})

export class AppTopBarComponent implements OnInit {

    bsModalProfileDialogComponent: DynamicDialogRef;

    languages: Language[];

    public defaultLanguage: Language = null;

    public displayAvatar: SafeUrl = '';
    public displayLogoCompany: SafeUrl = '';

    constructor(public app: MainAppComponent,
                private dialogService: DialogService,
                private domSanitizer: DomSanitizer,
                private languageState: DefaultLanguageState,
                private translateService: TranslateService,
                private breadCrumbService: BreadCrumbService,
                private appAlertService: AppAlertService,
                private uiBlockService: UiBlockService,
                ) {

      this.defaultLanguage = this.languageState.getDefaultLanguage();

    }

    ngOnInit() {
        this.languages = LanguageTypes.getValues();
    }

    onSignOutClick(event, item) {
    }

    public changeLanguage(language: Language) {
        this.defaultLanguage = language;
        this.languageState.setDefaultLanguage(this.defaultLanguage);

        this.translateService.use(language.value);

        // to rebuild breadcrumb
        this.breadCrumbService.clearReloadInfo();
        this.breadCrumbService.sendReloadInfo('rebuild');

      }
}
