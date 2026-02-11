import { Component, SimpleChanges, ElementRef, Input, OnInit, OnChanges, OnDestroy, Renderer2, ViewChild, ComponentFactoryResolver, ChangeDetectionStrategy, ViewEncapsulation, SimpleChange } from '@angular/core';

import { Subscription } from 'rxjs';

import { BreadCrumbService } from 'src/app/common/common-components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dashboardId: string;

  protected subscription: Subscription;

  visibleSidebar2;

  mode: string;

  constructor(private breadCrumbService: BreadCrumbService,
              ) {

  }

  public ngOnInit() {
    this.breadCrumbService.sendReloadInfo('reload');
  }

  protected unsubscribe() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public ngOnChanges(changes: SimpleChanges) {

    this.unsubscribe();

  }

  public ngOnDestroy() {

    this.unsubscribe();
  }

}