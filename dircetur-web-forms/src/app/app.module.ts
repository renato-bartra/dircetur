import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AdminGuard } from './auth/admin.guard';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
  ],
  providers: [
    //AdminGuard,
    //Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }