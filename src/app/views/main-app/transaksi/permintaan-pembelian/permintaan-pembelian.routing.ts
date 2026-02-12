import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermintaanPembelianBrowseComponent } from './browse/permintaan-pembelian-browse.component';
import { PermintaanPembelianInputComponent } from './input/permintaan-pembelian-input.component';

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
        component: PermintaanPembelianBrowseComponent,
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
            component: PermintaanPembelianInputComponent,
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
export class PermintaanPembelianRoutingModule { }
