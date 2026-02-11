import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SBreadcrumbComponent } from './breadcrumb.component';
import { BreadCrumbService } from './breadcrumb.service';
import { TranslateModule } from '@ngx-translate/core';
import {TooltipModule} from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PipeModule } from 'src/app/base/pipe/pipe.module';
import { PanelModule } from 'primeng/panel';
import { TranslateMessageService } from '../../common-services/translate.message.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressBarModule } from 'primeng';

@NgModule({
  declarations: [
    SBreadcrumbComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BreadcrumbModule,
    TranslateModule,
    TooltipModule,
    OverlayPanelModule,
    TabViewModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    AccordionModule,
    CalendarModule,
    DropdownModule,
    PipeModule,
    PanelModule,
    ScrollPanelModule,
    ProgressBarModule,
  ],
  exports: [SBreadcrumbComponent],
  providers: [BreadCrumbService, 
              TranslateMessageService,]
})
export class SBreadCrumbModule { }
