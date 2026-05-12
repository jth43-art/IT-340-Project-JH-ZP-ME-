import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private baseUrl = 'http://100.105.95.54:3000/playlists';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders() {
    let user: any = {};

    if (isPlatformBrowser(this.platformId)) {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    }

    return {
      headers: new HttpHeaders({
        'x-user-id': user.id || '',
        'x-user-email': user.email || '',
        'x-user-role': user.role || 'user'
      })
    };
  }

  getPlaylists(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}?t=${Date.now()}`,
      this.getHeaders()
    );
  }

  createPlaylist(name: string): Observable<any> {
    return this.http.post(
      this.baseUrl,
      { title: name },
      this.getHeaders()
    );
  }

  deletePlaylist(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      this.getHeaders()
    );
  }

  updatePlaylist(id: string, updatedData: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      updatedData,
      this.getHeaders()
    );
  }

  addSongToPlaylist(id: string, song: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${id}/songs`,
      { song },
      this.getHeaders()
    );
  }
}
