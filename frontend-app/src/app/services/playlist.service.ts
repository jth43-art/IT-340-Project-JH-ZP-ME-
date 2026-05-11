import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private baseUrl = 'http://100.105.95.54:3000/playlists';

  constructor(private http: HttpClient) {}

  getPlaylists(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  createPlaylist(playlistName: string): Observable<any> {
    return this.http.post(this.baseUrl, { name: playlistName });
  }
}