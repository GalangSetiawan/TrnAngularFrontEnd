import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, NoPreloading } from '@angular/router';

export const routes: Routes = [
  { path: '',
    loadChildren: () => import('./views/main-app/main-app.module').then((m) => m.MainAppModule),
  },
    { path: '**', redirectTo: 'login' }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {
  useHash: true,
  preloadingStrategy: NoPreloading,
});
