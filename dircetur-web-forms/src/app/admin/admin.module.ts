import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin.routing';
import { ComponentsModule } from './components/components.module';
import { AdminComponent } from './admin.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
  ],
  declarations: [ 
    AdminComponent,
    AdminLayoutComponent,
  ],
  providers: [],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
