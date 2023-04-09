import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';
import { PublicComponent } from './public.component';
import { PublicRoutingModule } from './public.routing';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    PublicComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
  ],
  bootstrap: [PublicComponent]
})
export class PublicModule { }
