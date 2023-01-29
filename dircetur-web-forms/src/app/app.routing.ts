import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// import { NotFoundComponent } from "./core/shared/not-found/not-found.component";

// guard para el admin
// import { AdminGuard } from "./auth/admin.guard";

const routes: Routes = [
    { path:'', loadChildren: () => import('./public/public.module').then(m => m.PublicModule)},
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'lodging', loadChildren: () => import('./lodging/lodging.module').then(m=> m.LodgingModule)},
    { path: 'login', loadChildren: () => import('./login/login.module').then(m=> m.LoginModule)}
    //{ path:'**', component: NotFoundComponent}
];

@NgModule({
    imports:[
        RouterModule.forRoot(routes, {useHash: true})
    ],
    exports:[
        RouterModule
    ]
})

export class AppRoutingModule {
    constructor() {}
}