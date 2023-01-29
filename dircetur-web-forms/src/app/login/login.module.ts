import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login.routing';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { LoginLodgingComponent } from './login-lodging/login-lodging.component';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    LoginComponent,
    LoginAdminComponent,
    LoginLodgingComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class LoginModule { }
