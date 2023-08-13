import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminPanelModule } from './admin-panel/admin-panel.module';


const routes: Routes = [
  { path: 'admin-panel', loadChildren: () => import('./admin-panel/admin-panel.module').then((m) => m.AdminPanelModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
