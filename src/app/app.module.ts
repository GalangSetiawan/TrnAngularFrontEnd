import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutes} from './app.routes';


// Application Components
import {AppComponent} from './app.component';

// Application services
import { UiBlockService } from './common/common-services/ui-block.service';
import { ConfirmationService } from 'primeng/api';
import { AlertModule } from './common/common-components/alert/alert-alert.module';
import { BlockUIModule } from 'ng-block-ui';
import { StdMessageTranslator } from './common/common-services/standar-api-message-translator';
import { SBreadCrumbModule } from './common/common-components/breadcrumb/breadcrumb.module';

import { LZStringModule, LZStringService } from 'ng-lz-string';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BaseModule } from './base/base.module';
import { InternationalizationModule } from './base/internationalization/internationalization.module';

@NgModule({
    imports: [
        BaseModule,
        BlockUIModule.forRoot(),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        ConfirmDialogModule,
        AlertModule,
        SBreadCrumbModule,
        LZStringModule,
        NgIdleKeepaliveModule.forRoot(),
        InternationalizationModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        UiBlockService, ConfirmationService, StdMessageTranslator, LZStringService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
