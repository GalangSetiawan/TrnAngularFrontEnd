import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceManualBrowseComponent } from './browse/invoice-manual-browse.component';
import { InvoiceManualInputComponent } from './input/invoice-manual-input.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: null
    },
    children: [
      { path: '',
        data: {
          breadcrumb: null
        },
        component: InvoiceManualBrowseComponent,
      },
      {
        path: 'input',
        data: {
          breadcrumb: 'Input'
        },
        children: [
          { path: '',
            data: {
              breadcrumb: null
            },
            component: InvoiceManualInputComponent,
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceManualRoutingModule { }

