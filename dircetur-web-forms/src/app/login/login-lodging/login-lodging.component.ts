import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DIRCETURAPIServices } from "../../services/DIRCETURAPIServices";
import { Londge } from "app/core/modules/Londge";

@Component({
  selector: 'app-login-lodging',
  templateUrl: './login-lodging.component.html',
  styleUrls: ['./login-lodging.component.css']
})
export class LoginLodgingComponent implements OnInit {

  private regexEamail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  // Router
  private router: Router;

  // Forms Controls
  email: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.regexEamail),
  ]);
  password: FormControl = new FormControl("", [Validators.required]);
  // Form
  public loginForm: FormGroup;

  // User
  public user: Londge;

  constructor(private apiServices: DIRCETURAPIServices, router: Router) {
    this.router = router;
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  // Get errors
  getEmailError() {
    if (this.email.hasError("required")) {
      return "El correo es requerido";
    } else if (this.email.hasError("pattern")) {
      return "Por favor, el correo debe tener el formato correo. Ejmp: ejemplo@ejemplo.com";
    }
  }
  getPasswordError() {
    return "La contraseña es requerida";
  }

  onSubmit() {
    this.apiServices.login(this.loginForm.value, 'londges').subscribe((response) => {
      if ((response.code = 200)) {
        this.user = response.body;
        localStorage.setItem("token", response.message);
        localStorage.setItem("londgedata", JSON.stringify(response.body));
        this.router.navigate(["/lodging"]);
      }
    });
  }

}
