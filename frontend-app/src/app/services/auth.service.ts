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
public userRole: string = 'user'; 

  // 2. Add this function to save data when login is successful
  setUserData(username: string, role: string) {
    this.loggedInUser = username;
    this.userRole = role;
    localStorage.setItem('role', role); // Keeps the role even if page refreshes
  }

  // 3. Add this helper function
  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

login(credentials: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
    tap((res: any) => {
      // Save the username from the backend response
      this.loggedInUser = res.username;
      this.userRole = res.role; // Assuming the backend sends 'admin' or 'user'
      localStorage.setItem('role', res.role);
    })
  );
}

  getUsername() {
    return this.currentUser || localStorage.getItem('username') || 'Guest';
  }
}
