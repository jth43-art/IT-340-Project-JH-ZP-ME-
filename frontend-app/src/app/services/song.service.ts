import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private baseUrl = 'http://100.105.95.54:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get all uploaded songs from MongoDB
  getSongs(): Observable<any> {
    const headers =
      this.authService.getAuthHeaders();

    return this.http.get<any>(
      `${this.baseUrl}/api/songs`,
      { headers }
    );
  }

  // Search music
  searchSongs(query: string): Observable<any> {
    const headers =
      this.authService.getAuthHeaders();

    return this.http.get<any>(
      `${this.baseUrl}/search?query=${encodeURIComponent(query)}`,
      { headers }
    );
  }

  // Stream an uploaded MP3
  streamSong(songId: string): Observable<Blob> {
    const headers =
      this.authService.getAuthHeaders();

    return this.http.get(
      `${this.baseUrl}/api/songs/${songId}/stream`,
      {
        headers,
        responseType: 'blob'
      }
    );
  }
}
