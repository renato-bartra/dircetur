import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { PublicComponent } from './public.component';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public.routing';

@NgModule({
  declarations: [
    PublicComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
  ],
  bootstrap: [PublicComponent]
})
export class PublicModule { }
