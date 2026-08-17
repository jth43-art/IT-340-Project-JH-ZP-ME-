import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://100.105.95.54:3000';

  // Properties required by existing TuneVault components
  currentUser: string = '';
  loggedInUser: string = '';
  userRole: string = 'user';

  constructor(private http: HttpClient) {}

  // ==========================================
  // REGISTER
  // ==========================================

  register(userData: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/register`,
      userData
    );
  }

  // ==========================================
  // LOGIN WITH USERNAME / EMAIL + PASSWORD
  // ==========================================

  login(credentials: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/login`,
      credentials
    ).pipe(
      tap((res: any) => {

        // A normal login returns the real JWT here.
        // MFA-enabled accounts return a 403 instead,
        // so this code will NOT run until MFA is complete.
        if (res?.token) {
          this.storeSession(res);
        }

      })
    );
  }

  // ==========================================
  // MFA LOGIN VERIFICATION
  // ==========================================

  verifyMfaLogin(
    tempToken: string,
    token: string
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/api/mfa/login/verify`,
      {
        tempToken,
        token
      }
    ).pipe(
      tap((res: any) => {

        // MFA succeeded.
        // Backend has now returned the real JWT.
        if (res?.token) {
          this.storeSession(res);
        }

      })
    );
  }

  // ==========================================
  // TEMPORARY MFA TOKEN
  // ==========================================

  saveMfaTempToken(tempToken: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'mfaTempToken',
        tempToken
      );
    }
  }

  getMfaTempToken(): string {
    if (typeof localStorage === 'undefined') {
      return '';
    }

    return localStorage.getItem(
      'mfaTempToken'
    ) || '';
  }

  clearMfaTempToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(
        'mfaTempToken'
      );
    }
  }

  // ==========================================
  // STORE AUTHENTICATED SESSION
  // ==========================================

  private storeSession(res: any): void {

    const token =
      res?.token ||
      res?.accessToken ||
      '';

    const user =
      res?.user ||
      {};

    this.loggedInUser =
      user?.username ||
      'User';

    this.currentUser =
      this.loggedInUser;

    this.userRole =
      user?.role ||
      'user';

    if (typeof localStorage === 'undefined') {
      return;
    }

    if (token) {
      localStorage.setItem(
        'token',
        token
      );
    }

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    localStorage.setItem(
      'username',
      this.loggedInUser
    );

    localStorage.setItem(
      'role',
      this.userRole
    );

    // MFA challenge is finished once
    // the real authentication token exists.
    this.clearMfaTempToken();
  }

  // ==========================================
  // USER DATA
  // ==========================================

  setUserData(
    username: string,
    role: string
  ): void {

    this.loggedInUser = username;
    this.currentUser = username;
    this.userRole = role;

    if (typeof localStorage !== 'undefined') {

      localStorage.setItem(
        'username',
        username
      );

      localStorage.setItem(
        'role',
        role
      );

    }
  }

  // ==========================================
  // AUTH HEADERS
  // ==========================================

  getAuthHeaders(): HttpHeaders {

    if (typeof localStorage === 'undefined') {
      return new HttpHeaders();
    }

    const token =
      localStorage.getItem('token') || '';

    const userJson =
      localStorage.getItem('user');

    const user =
      userJson
        ? JSON.parse(userJson)
        : null;

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-user-email': user?.email || '',
      'x-user-id':
        user?.id ||
        user?._id ||
        ''
    });
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    this.currentUser = '';
    this.loggedInUser = '';
    this.userRole = 'user';

    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  }

  // ==========================================
  // AUTH STATUS
  // ==========================================

  isLoggedIn(): boolean {

    if (typeof localStorage === 'undefined') {
      return false;
    }

    // Require the real JWT.
    // Do not count the temporary MFA token
    // as a logged-in session.
    return !!localStorage.getItem('token');
  }

  getUsername(): string {

    if (this.loggedInUser) {
      return this.loggedInUser;
    }

    if (typeof localStorage === 'undefined') {
      return 'Guest';
    }

    return (
      localStorage.getItem('username') ||
      'Guest'
    );
  }

  isAdmin(): boolean {

    if (this.userRole === 'admin') {
      return true;
    }

    if (typeof localStorage === 'undefined') {
      return false;
    }

    return (
      localStorage.getItem('role') === 'admin'
    );
  }
}
