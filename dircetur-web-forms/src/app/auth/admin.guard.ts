import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { DIRCETURAPIServices } from "app/services/DIRCETURAPIServices";
import { Observable, firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {

  private guard: boolean = false;

  constructor(
    private router: Router,
    private _apiService: DIRCETURAPIServices
  ) {}

  async canActivate(): Promise<boolean> {
    let token = localStorage.getItem("token");

    // VERIFICA SI EXITE TOKEN
    if (await firstValueFrom(this._apiService.verifyToken(token, "user"))) {
      return true
    }
    else {
      this.router.navigate(['login/admin'])
      return false
    }
  }
}
