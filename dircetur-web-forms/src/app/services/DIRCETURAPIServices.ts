import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { APIURL } from "./APIUrl";
import { IResponseObject } from "../core/modules/IResponseObject";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class DIRCETURAPIServices {
  private url: string;
  private headers: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private _http: HttpClient) {
    this.url = APIURL.url;
  }

  login(params: {}, type: string): Observable<IResponseObject> {
    return this._http
      .post<IResponseObject>(this.url + type + "/login", params, { headers: this.headers.delete('Authorization') })
      .pipe(catchError(this.handleError));
  }

  verifyToken(token: string, role: string): Observable<boolean> {
    const params = { token: token, role: role };
    return this._http
      .post<boolean>(this.url + "/verify-token", params, { headers: this.headers.delete('Authorization') })
      .pipe(catchError(this.handleError));
  }

  get(token: string, route: string): Observable<IResponseObject> {
    return this._http
      .get<IResponseObject>(this.url + route, { headers: this.headers.set("Authorization", token) })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      $.notify(
        {
          icon: "notifications",
          message: `ERROR: ${error.error.message}`,
        },
        {
          type: "danger",
          timer: 3000,
          placement: {
            from: "top",
            align: "right",
          },
          template:
            '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
            '<i class="material-icons" data-notify="icon">notifications</i> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            "</div>" +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            "</div>",
        }
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(error.error.message);
  }
}
