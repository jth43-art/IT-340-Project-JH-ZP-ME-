import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SongService {
  private baseUrl = 'http://100.105.95.54:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Retrieves all songs from the backend
  getSongs(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/songs`, { headers });
  }

  // Search songs endpoint for Task 4
  searchSongs(query: string): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/songs/search?q=${encodeURIComponent(query)}`, { headers });
  }
}
