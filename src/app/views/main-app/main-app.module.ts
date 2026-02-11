import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainAppRoutingModule } from './main-app.routing';

import { MainAppComponent } from './main-app.component';

import { BlockUIModule } from 'ng-block-ui';
import { AppTopBarComponent } from './main-layout/top-bar/app.topbar.component';
import { AppFooterComponent } from './main-layout/footer/app.footer.component';
import { AppRightPanelComponent } from './main-layout/right-panel/app.rightpanel.component';
import { SBreadCrumbModule } from 'src/app/common/common-components/breadcrumb/breadcrumb.module';
import { AppMenuComponent } from './main-layout/menu/app.menu.component';
import { AppMenuitemComponent } from './main-layout/menu/app.menuitem.component';
import { TabViewModule } from 'primeng/tabview';
import { MenuService } from './main-layout/menu/app.menu.service';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateMessageService } from 'src/app/common/common-services/translate.message.service';

@NgModule({
  imports: [
    BlockUIModule.forRoot(),
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    TabViewModule,
    MainAppRoutingModule,
    SBreadCrumbModule,

    CheckboxModule,
    PanelModule,
    ChartModule,
    ButtonModule,
    CalendarModule,
    TableModule,
    FullCalendarModule,

    AccordionModule,
    CardModule,
    DynamicDialogModule,
    InputNumberModule,
    PasswordModule,
    TranslateModule,

],
  declarations: [
    MainAppComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppRightPanelComponent,
    AppMenuComponent,
    AppMenuitemComponent,
  ],
  entryComponents: [
  ],
  providers: [MenuService,
              TranslateMessageService,
              DecimalPipe,]
})
export class MainAppModule { }
