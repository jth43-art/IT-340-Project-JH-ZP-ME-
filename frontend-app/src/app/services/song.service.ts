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

  // ========================================
  // GET UPLOADED SONGS
  // ========================================

  getSongs(): Observable<any> {
    const headers =
      this.authService.getAuthHeaders();

    return this.http.get<any>(
      `${this.baseUrl}/api/songs`,
      { headers }
    );
  }

  // ========================================
  // SEARCH MUSIC
  // ========================================

  searchSongs(query: string): Observable<any> {
    const headers =
      this.authService.getAuthHeaders();

    return this.http.get<any>(
      `${this.baseUrl}/search?query=${encodeURIComponent(query)}`,
      { headers }
    );
  }

  // ========================================
  // STREAM UPLOADED SONG
  // ========================================

  getStreamUrl(songId: string): string {
    return `${this.baseUrl}/api/songs/${songId}/stream`;
  }
}
