import { Injectable, OnDestroy } from '@angular/core';

import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class UiBlockService implements OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  constructor() {
  }

  public ngOnDestroy() {
    // this.appAlertSource.complete();
  }

  public showUiBlock(): void {
    this.blockUI.start();
  }

  public hideUiBlock() {
    this.blockUI.stop();
  }
}
