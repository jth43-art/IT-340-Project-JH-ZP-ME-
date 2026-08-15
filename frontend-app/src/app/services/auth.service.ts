import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://100.105.95.54:3000';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((res: any) => {
        // Extract token and user object from response
        const token = res.token || res.accessToken || '';
        const user = res.user || res;

        if (token) {
          localStorage.setItem('token', token);
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('username', user.username || 'User');
          localStorage.setItem('role', user.role || 'user');
        }
      })
    );
  }

  // Returns auth headers required by downstream APIs (Task 2, 3, & 4)
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
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('user');
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'Guest';
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }
}
