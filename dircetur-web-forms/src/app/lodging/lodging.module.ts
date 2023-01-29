import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LodgingComponent } from './lodging.component';
import { HeaderComponent } from './templates/header/header.component';
import { FooterComponent } from './templates/footer/footer.component';
import { LodgingRoutingModule } from './lodging.routing';
import { NewFormComponent } from './components/new-form/new-form.component';
import { ListFormsComponent } from './components/list-forms/list-forms.component';

@NgModule({
  declarations: [
    HomeComponent,
    LodgingComponent,
    HeaderComponent,
    FooterComponent,
    NewFormComponent,
    ListFormsComponent
  ],
  imports: [
    CommonModule,
    LodgingRoutingModule
  ]
})
export class LodgingModule { }
