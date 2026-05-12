import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) {}

  // AUTH HEADERS

  private getHeaders() {

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    return {
      headers: new HttpHeaders({
        'x-user-id': user.id || '',
        'x-user-email': user.email || '',
        'x-user-role': user.role || 'user'
      })
    };
  }

  // GET ALL PLAYLISTS

  getPlaylists(): Observable<any> {

    return this.http.get<any>(
      this.baseUrl,
      this.getHeaders()
    );

  }

  // CREATE PLAYLIST

  createPlaylist(name: string): Observable<any> {

    return this.http.post(
      this.baseUrl,
      {
        title: name
      },
      this.getHeaders()
    );

  }

  // DELETE PLAYLIST

  deletePlaylist(id: string): Observable<any> {

    return this.http.delete(
      `${this.baseUrl}/${id}`,
      this.getHeaders()
    );

  }

  // UPDATE PLAYLIST

  updatePlaylist(
    id: string,
    updatedData: any
  ): Observable<any> {

    return this.http.put(
      `${this.baseUrl}/${id}`,
      updatedData,
      this.getHeaders()
    );

  }

  // ADD SONG TO PLAYLIST

  addSongToPlaylist(
    id: string,
    song: any
  ): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/${id}/songs`,
      {
        song
      },
      this.getHeaders()
    );

  }
}
