import {Component} from '@angular/core';
import { MainAppComponent } from '../../main-app.component';

@Component({
    selector: 'app-rightpanel',
    templateUrl: './app.rightpanel.component.html'
})
export class AppRightPanelComponent {

    constructor(public app: MainAppComponent) {}
}
