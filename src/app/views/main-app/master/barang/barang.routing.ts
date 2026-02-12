import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BarangBrowseComponent } from './browse/barang-browse.component';
import { BarangInputComponent } from './input/barang-input.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: null
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: null
        },
        component: BarangBrowseComponent,
      },
      {
        path: 'input',
        data: {
          breadcrumb: 'Input'
        },
        children: [
          {
            path: '',
            data: {
              breadcrumb: null
            },
            component: BarangInputComponent,
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
export class BarangRoutingModule { }
