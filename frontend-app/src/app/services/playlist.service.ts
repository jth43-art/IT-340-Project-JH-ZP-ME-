import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  // Use Jackson's Tailscale IP
  private baseUrl = 'http://100.105.95.54:3000/playlists';

  constructor(private http: HttpClient) {}

  // Fetch all playlists
  getPlaylists(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Create a new one
  createPlaylist(name: string): Observable<any> {
    return this.http.post(this.baseUrl, { name });
  }
}
