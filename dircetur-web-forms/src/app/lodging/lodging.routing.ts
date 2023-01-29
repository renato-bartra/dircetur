import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './home/home.component';
import { LodgingComponent } from './lodging.component';
import { NewFormComponent } from './components/new-form/new-form.component';
import { ListFormsComponent } from './components/list-forms/list-forms.component';

const routes: Routes = [
  { path: '', component: LodgingComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'new-form', component: NewFormComponent },
    { path: 'list-forms', component: ListFormsComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LodgingRoutingModule {}