import {Component, OnInit, ViewEncapsulation, EventEmitter, Output, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {MenuItem} from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { BreadCrumbService } from './breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sbreadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SBreadcrumbComponent implements OnInit, OnDestroy {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  private ngUnsubscribe: Subject<boolean> = new Subject();

  readonly home = {icon: 'pi pi-home', url: 'home'};
  menuItems: MenuItem[];

  private reloadBreadcrumbSubs: Subscription;
  private savedDashboardSubs: Subscription;
  private newNotificationCountSubs: Subscription;

  public lastLabel = '';
  public lastUrl = '';
  public dashboardEdited = false;
  public firstReloaded = true;
  public notifCount = '0';

  public notificationCount = 0;
  // public defaultCompany: Company = null;
  // public userLogin = new UserLogin();

  constructor(
              private activatedRoute: ActivatedRoute,
              private breadCrumbService: BreadCrumbService,
              private translateService: TranslateService,
              private router: Router,
              ) {

    this.reloadBreadcrumbSubs = this.breadCrumbService.getReloadInfo()
      .pipe()
      .subscribe(
        (message: any) => {
          this.menuItems = this.createBreadcrumbs(this.activatedRoute.root);
        }
      );

    this.newNotificationCountSubs = this.breadCrumbService.getNotificationCount()
      .pipe()
      .subscribe(
        (result) => {
          this.notificationCount = result;
        }
      );

  }

  ngOnInit() {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.dashboardEdited = false;
        this.menuItems = this.createBreadcrumbs(this.activatedRoute.root)

        this.firstReloaded = false;
      });

  }

  // string asalnya = '#' tapi untuk model breadcrumb ini bila diberi # dia tidak mau jalan
  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

    //   const label = child.snapshot.data[SBreadcrumbComponent.ROUTE_DATA_BREADCRUMB];
      let label = child.snapshot.data[SBreadcrumbComponent.ROUTE_DATA_BREADCRUMB];
      if (label !== null && label !== undefined) {

        this.lastLabel = label;
        this.translateService.get(label)
          .subscribe((translation) => {
            label = translation;
          }
        );

        this.lastUrl = url;
        
        breadcrumbs.push({label, url});
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }


  editDashboard() {
    this.dashboardEdited = true;
  }

  public ngOnDestroy() {

    this.savedDashboardSubs.unsubscribe();
  }

  public goDashboard() {
    this.router.navigate(['./dashboard']);
  }
}
