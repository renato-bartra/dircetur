import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-login-admin",
  templateUrl: "./login-admin.component.html",
  styleUrls: ["./login-admin.component.css"],
})
export class LoginAdminComponent implements OnInit {
  private regexEamail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  // Forms Controls
  email: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.regexEamail),
  ])
  password: FormControl = new FormControl("", [Validators.required])
  // Form
  public loginForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  // Get errors
  getEmailError() {
    if (this.email.hasError('required')){
      return 'El correo es requerido'
    }
    else if (this.email.hasError('pattern')) {
      return 'Por favor, el correo debe tener el formato correo. Ejmp: ejemplo@ejemplo.com' 
    }
  }
  getPasswordError(){
    return 'La contraseña es requerida' 
  }


}
