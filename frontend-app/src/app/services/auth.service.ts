import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://100.105.95.54:3000';

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
  // LOGIN
  // ==========================================

  login(credentials: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/login`,
      credentials
    ).pipe(
      tap((res: any) => {
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
        if (res?.token) {
          this.storeSession(res);
        }
      })
    );
  }

  // ==========================================
  // MFA SETUP - GENERATE QR CODE
  // ==========================================

  enableMfa(): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/api/mfa/enable`,
      {},
      {
        headers: this.getAuthHeaders()
      }
    );

  }

  // ==========================================
  // MFA SETUP - VERIFY FIRST 6-DIGIT CODE
  // ==========================================

  verifyMfaSetup(token: string): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/api/mfa/verify`,
      {
        token
      },
      {
        headers: this.getAuthHeaders()
      }
    );

  }

  // ==========================================
  // DISABLE MFA
  // ==========================================

  disableMfa(): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/api/mfa/disable`,
      {},
      {
        headers: this.getAuthHeaders()
      }
    );

  }

  // ==========================================
  // TEMPORARY MFA LOGIN TOKEN
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
  // STORE LOGGED-IN SESSION
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

    this.clearMfaTempToken();
  }

  // ==========================================
  // SET USER DATA
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
  // LOGIN STATUS
  // ==========================================

  isLoggedIn(): boolean {

    if (typeof localStorage === 'undefined') {
      return false;
    }

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
