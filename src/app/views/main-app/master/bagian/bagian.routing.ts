import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BagianBrowseComponent } from './browse/bagian-browse.component';
import { BagianInputComponent } from './input/bagian-input.component';

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
        component: BagianBrowseComponent,
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
            component: BagianInputComponent,
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
export class BagianRoutingModule { }
