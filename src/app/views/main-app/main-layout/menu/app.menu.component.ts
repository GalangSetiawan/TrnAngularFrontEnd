import { Component, OnInit } from '@angular/core';
import { MainAppComponent } from '../../main-app.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Menu } from 'src/app/common/common-model/menu.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  template: `
    <ul class="layout-menu">
      <li app-menuitem *ngFor="let item of model; let i = index" [item]="item" [index]="i" [root]="true"></li>
    </ul>
  `,
})

export class AppMenuComponent implements OnInit {

  private ngUnsubscribe: Subject<boolean> = new Subject();
  model: any[] = [];

  menusFromAPI: Menu[];

  constructor(public app: MainAppComponent,
              private translateService: TranslateService,) {}

  ngOnInit() {

    //this.initMenu();

    this.model = [
      { label: 'Dashboard', icon: 'fa fa-fw fa-home', routerLink: ['/'] },
      {
        label: 'Master',
        icon: 'fa fa-fw fa-key',
        routerLink: ['/master'],
        items: [
          {
            label: 'Customer',
            icon: 'fa fa-fw fa-leaf',
            routerLink: ['/master/customer'],
          },
        ],
      },
      {
        label: 'Transaksi',
        icon: 'fa fa-fw fa-server',
        routerLink: ['/transaksi'],
        items: [
          {
            label: 'InvoiceManual',
            icon: 'fa fa-fw fa-chart-plus',
            routerLink: ['/transaksi/invoice-manual'],
          },
        ],
      },
    ];

  }

  changeTheme(theme: string, scheme: string) {
    this.changeStyleSheetsColor('theme-css', 'theme-' + theme + '.css');
    this.changeStyleSheetsColor('layout-css', 'layout-' + theme + '.css');

    this.app.menuMode = scheme;
  }

  changeStyleSheetsColor(id, value) {
    const element = document.getElementById(id);
    const urlTokens = element.getAttribute('href').split('/');
    urlTokens[urlTokens.length - 1] = value;

    const newURL = urlTokens.join('/');

    this.replaceLink(element, newURL);
  }

  isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }

  replaceLink(linkElement, href) {
    if (this.isIE()) {
      linkElement.setAttribute('href', href);
    } else {
      const id = linkElement.getAttribute('id');
      const cloneLinkElement = linkElement.cloneNode(true);

      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', id + '-clone');

      linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);
      });
    }
  }

  initMenu() {

    this.model = [];
  }

}
