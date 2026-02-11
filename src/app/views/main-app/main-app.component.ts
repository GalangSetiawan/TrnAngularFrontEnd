import { Component, Renderer2, OnInit, HostListener } from '@angular/core';
import { Idle } from '@ng-idle/core';
import { Router } from '@angular/router';
import { MenuService } from './main-layout/menu/app.menu.service';
import { Subject } from 'rxjs';
import { ThemeHelper } from 'src/app/helper/theme-helper';
import { UiBlockService } from 'src/app/common/common-services/ui-block.service';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';

@Component({
    selector: 'app-root',
    templateUrl: './main-app.component.html',
    styleUrls: ['./main-app.component.css'],
    providers: [DialogService]
})
export class MainAppComponent implements OnInit {

    layoutMode = 'static';

    megaMenuMode = 'light';

    menuMode = 'light';

    profileMode = 'top';

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    menuHoverActive: boolean;

    rightPanelActive: boolean;

    rightPanelClick: boolean;

    megaMenuActive: boolean;

    megaMenuClick: boolean;

    usermenuActive: boolean;

    usermenuClick: boolean;

    activeProfileItem: any;

    bsModalReLoginComponent: DynamicDialogRef;

    constructor(public renderer: Renderer2, private menuService: MenuService, private idle: Idle,
                public router: Router) {

    }

    ngOnInit() {
        ThemeHelper.noirTheme();

        registerLocaleData(localeId, 'id');
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        if (!this.megaMenuClick) {
            this.megaMenuActive = false;
        }

        if (!this.usermenuClick && this.isSlim()) {
            this.usermenuActive = false;
            this.activeProfileItem = null;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.menuService.reset();
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
        this.megaMenuClick = false;
        this.usermenuClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;

        if (this.layoutMode === 'overlay') {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();
    }

    onRightPanelClick() {
        this.rightPanelClick = true;
    }

    onMegaMenuButtonClick(event) {
        this.megaMenuClick = true;
        this.megaMenuActive = !this.megaMenuActive;
        event.preventDefault();
    }

    onMegaMenuClick() {
        this.megaMenuClick = true;
    }

    hideOverlayMenu() {
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isHorizontal() {
        return this.layoutMode === 'horizontal';
    }

    isSlim() {
        return this.layoutMode === 'slim';
    }

    isOverlay() {
        return this.layoutMode === 'overlay';
    }

}
