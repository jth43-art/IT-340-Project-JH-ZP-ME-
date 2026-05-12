import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://100.105.95.54:3000';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

// Add a variable to store the name
currentUser: string = '';
public loggedInUser: string = '';

login(credentials: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
    tap((res: any) => {
      // Save the username from the backend response
      this.currentUser = res.username || credentials.login; 
      localStorage.setItem('username', this.currentUser);
    })
  );
}

  getUsername() {
    return this.currentUser || localStorage.getItem('username') || 'Guest';
  }
}