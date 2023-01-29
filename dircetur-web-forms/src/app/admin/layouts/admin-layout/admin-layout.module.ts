import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { FiscalizacionComponent } from "../../fiscalizacion/fiscalizacion.component";
// import { MatButtonModule } from "@angular/material/button";
// import { MatRippleModule } from "@angular/material/core";
// import { MatTooltipModule } from "@angular/material/tooltip";
// import { MatSelectModule } from "@angular/material/select";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    // MatButtonModule,
    // MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    // MatSelectModule,
    // MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    DashboardComponent,
    FiscalizacionComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
  ],
  exports: [RouterModule],
})
export class AdminLayoutModule {}
