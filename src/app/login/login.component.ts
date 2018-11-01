import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { passValidator } from './CustomValidator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
interface LArray {
  ErrorMsg: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  FPvisible: boolean;
  LCallbackMsgs:any = {}
  CallbackMsgs = [];
  LoginForm: FormGroup;
  SignupForm: FormGroup;
  ForgotForm: FormGroup;
  EmailPattern: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(private _http: HttpClient, private _LoginService: LoginService, private _router: Router) {

    this.LoginForm = new FormGroup({
      'Email': new FormControl('', [Validators.required, Validators.pattern(this.EmailPattern)// Validators.email
      ]),
      'Password': new FormControl('', Validators.required)
    });

    this.SignupForm = new FormGroup({
      'FirstName': new FormControl('', Validators.required),
      'LastName': new FormControl('', Validators.required),
      'Email': new FormControl('', [Validators.required, Validators.pattern(this.EmailPattern)// Validators.email
      ]),
      'DisplayName': new FormControl('', Validators.required),
      'Mobile': new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
      'Password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'CfrPassword': new FormControl('', [Validators.required, passValidator])
    });

    this.SignupForm.controls.Password.valueChanges
      .subscribe(
        x => this.SignupForm.controls.CfrPassword.updateValueAndValidity()
      )

    this.ForgotForm = new FormGroup({
      'Email': new FormControl('', [Validators.required, Validators.pattern(this.EmailPattern)// Validators.email
      ])
    });

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  ngAfterViewInit() {
    //We loading the player script on after view is loaded
    const signupButton = document.getElementById('signup-button'),
      loginButton = document.getElementById('login-button'),
      userForms = document.getElementById('user_options-forms')
    /**
    * Add event listener to the "Sign Up" button
    */
    signupButton.addEventListener('click', () => {
      userForms.classList.remove('bounceRight')
      userForms.classList.add('bounceLeft')
    }, false)
    /**
    * Add event listener to the "Login" button
    */
    loginButton.addEventListener('click', () => {
      userForms.classList.remove('bounceLeft')
      userForms.classList.add('bounceRight')
    }, false)
  }


  onloginSubmit() {
    debugger
    if (this.LoginForm.valid) {
      //alert(JSON.stringify(this.form.value));
      this._LoginService.postlogindata(this.LoginForm.value).subscribe(data => {
        this.LCallbackMsgs = data;
        if (this.LCallbackMsgs[0].ErrorMsg == "Login Success") {
          this._router.navigate(['/Home']);
        }

        //  this.SignupForm.reset()
      },
        error => {
          if (error.error.ErrorMsg) {
            this.LCallbackMsgs = error.error;
          }
          else {
            console.error(error)
          }
        }
      );
    } else {
      this.validateAllFields(this.LoginForm);
    }
  }

  onsignupSubmit() {
    if (this.SignupForm.valid) {

      this._LoginService.postuserdata(this.SignupForm.value).subscribe(data => {
        this.CallbackMsgs = data;
        console.error(data)
        // this._router.navigate(['/']);
        //  this.SignupForm.reset()
      },
        error => {
          this.CallbackMsgs = error;
          console.error(error)

        }
      );


    } else {
      this.validateAllFields(this.SignupForm);
    }
  }

  validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  showDialog() {
    this.ForgotForm.reset();
    this.FPvisible = true;
  }
  onforgotSubmit() {
    if (this.ForgotForm.valid) {
      this._LoginService.postforgotpwd(this.ForgotForm.value).subscribe(data => {
        this.CallbackMsgs = data;
        console.log(data)
        // this._router.navigate(['/']);
        //  this.SignupForm.reset()
      },
        error => {
          this.CallbackMsgs = error;
          console.error(error)

        }
      );

    } else {
      this.validateAllFields(this.ForgotForm);
    }
  }

}
