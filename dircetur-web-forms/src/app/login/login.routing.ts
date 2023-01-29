import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { LoginLodgingComponent } from './login-lodging/login-lodging.component';

const routesLogin: Routes = [
  {path: '', component: LoginComponent, children:[
    {path: '', redirectTo: 'lodging', pathMatch: 'full'},
    {path: 'lodging', component: LoginLodgingComponent},
    {path: 'admin', component: LoginAdminComponent}
  ]}
]

@NgModule({
  imports: [RouterModule.forChild(routesLogin)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}