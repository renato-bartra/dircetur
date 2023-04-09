import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LondgeGuard } from "./auth/londge.guard";
import { AdminGuard } from "./auth/admin.guard";
import { NotFoundComponent } from "./public/not-found/not-found.component";

// import { NotFoundComponent } from "./core/shared/not-found/not-found.component";

// guard para el admin
// import { AdminGuard } from "./auth/admin.guard";

const routes: Routes = [
  { path: "", loadChildren: () => import("./public/public.module").then((m) => m.PublicModule) },
  {
    path: "admin",
    canActivate: [AdminGuard],
    loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "lodging",
    canActivate: [LondgeGuard],
    loadChildren: () => import("./lodging/lodging.module").then((m) => m.LodgingModule),
  },
  { path: "login", loadChildren: () => import("./login/login.module").then((m) => m.LoginModule) },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor() {}
}
