import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://100.105.95.54:3000';

  // Properties required by homepage-tv.component.ts
  currentUser: string = '';
  loggedInUser: string = '';
  userRole: string = 'user';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: any) => {
        const token = res.token || res.accessToken || '';
        const user = res.user || res;

        this.loggedInUser = user.username || 'User';
        this.currentUser = this.loggedInUser;
        this.userRole = user.role || 'user';

        if (token) {
          localStorage.setItem('token', token);
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('username', this.loggedInUser);
          localStorage.setItem('role', this.userRole);
        }
      })
    );
  }

  setUserData(username: string, role: string): void {
    this.loggedInUser = username;
    this.currentUser = username;
    this.userRole = role;
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-user-email': user?.email || '',
      'x-user-id': user?.id || user?._id || ''
    });
  }

  logout(): void {
    this.currentUser = '';
    this.loggedInUser = '';
    this.userRole = 'user';
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('user');
  }

  getUsername(): string {
    return this.loggedInUser || localStorage.getItem('username') || 'Guest';
  }

  isAdmin(): boolean {
    return this.userRole === 'admin' || localStorage.getItem('role') === 'admin';
  }
}
