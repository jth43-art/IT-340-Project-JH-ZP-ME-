import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  AuthService
} from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.css'
})

export default class LoginComponent {

  errorMessage: string = '';
  isSuccess: boolean = false;
  isBrowser: boolean = false;
  isLoading: boolean = false;

  loginForm = new FormGroup({

    identifier: new FormControl(
      '',
      [Validators.required]
    ),

    password: new FormControl(
      '',
      [Validators.required]
    )

  });


  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,

    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {

    this.isBrowser =
      isPlatformBrowser(
        this.platformId
      );
  }


  // ==========================================
  // LOGIN
  // ==========================================

  onLogin(): void {

    this.errorMessage = '';
    this.isSuccess = false;
    this.isLoading = false;

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      this.errorMessage =
        'Please enter your email/username and password.';

      this.cdr.detectChanges();

      return;
    }


    const inputVal =
      this.loginForm.value.identifier
        ?.trim() || '';

    const passwordVal =
      this.loginForm.value.password || '';


    const credentials = {

      email: inputVal,
      username: inputVal,
      identifier: inputVal,
      password: passwordVal

    };


    this.isLoading = true;


    this.authService
      .login(credentials)
      .subscribe({

        // ====================================
        // NORMAL LOGIN SUCCESS
        // MFA IS NOT ENABLED
        // ====================================

        next: (response: any) => {

          this.isLoading = false;
          this.isSuccess = true;

          this.errorMessage =
            'Login successful! Redirecting...';

          this.cdr.detectChanges();


          const user =
            response?.user ||
            {};


          let role =
            user?.role ||
            'user';


          if (
            this.isBrowser &&
            !user?.role
          ) {

            role =
              localStorage.getItem('role') ||
              'user';

          }


          const isAdmin =
            role === 'admin';


          const targetRoute =
            isAdmin
              ? '/admin-dashboard'
              : '/homepage-tv';


          setTimeout(() => {

            this.router.navigate([
              targetRoute
            ]);

          }, 500);

        },


        // ====================================
        // LOGIN ERROR OR MFA CHALLENGE
        // ====================================

        error: (err: any) => {

          this.isLoading = false;

          console.error(
            'Login Error Details:',
            err
          );


          // ==================================
          // MFA REQUIRED
          // ==================================

          if (
            err.status === 403 &&
            err.error?.mfaRequired === true &&
            err.error?.tempToken
          ) {

            this.authService
              .saveMfaTempToken(
                err.error.tempToken
              );


            this.router.navigate([
              '/mfa-verify'
            ]);

            return;
          }


          // ==================================
          // NORMAL LOGIN ERROR
          // ==================================

          this.isSuccess = false;


          if (
            err.status === 400 ||
            err.status === 401
          ) {

            this.errorMessage =
              err.error?.message ||
              'Invalid email/username or password.';

          }

          else if (
            err.status === 404
          ) {

            this.errorMessage =
              'User account not found.';

          }

          else if (
            err.error?.message
          ) {

            this.errorMessage =
              err.error.message;

          }

          else {

            this.errorMessage =
              'Unable to connect to server. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }

}
