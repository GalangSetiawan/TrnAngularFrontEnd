import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { GridsterModule } from 'angular-gridster2';


import { ButtonModule } from 'primeng/button';

import { DashboardComponent } from 'src/app/views/main-app/dashboard/dashboard.component';

import { DashboardRoutingModule } from 'src/app/views/main-app/dashboard/dashboard.routing';
import {PanelModule} from 'primeng/panel';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {CardModule} from 'primeng/card';
import {SidebarModule} from 'primeng/sidebar';
import {DragDropModule} from 'primeng/dragdrop';


@NgModule({
  declarations: [
    DashboardComponent,
  ],  entryComponents: [
  ],  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AccordionModule,
    TableModule,
    TranslateModule,
    ButtonModule,
    GridsterModule,
    DashboardRoutingModule,
    PanelModule,
    ScrollPanelModule,
    CardModule,
    SidebarModule,
    DragDropModule,
  ],
  exports: [
  ],
  providers: [ 
  ]})
export class DashboardModule { }
