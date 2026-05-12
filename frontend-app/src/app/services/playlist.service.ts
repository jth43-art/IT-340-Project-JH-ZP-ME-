import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private baseUrl = 'http://100.105.95.54:3000/playlists';

  constructor(private http: HttpClient) {}

  // GET ALL PLAYLISTS
  getPlaylists(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // CREATE PLAYLIST
  createPlaylist(name: string): Observable<any> {
    return this.http.post(this.baseUrl, {
      title: name
    });
  }

  // DELETE PLAYLIST
  deletePlaylist(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // UPDATE PLAYLIST
  updatePlaylist(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updatedData);
  }

  // ADD SONG TO PLAYLIST
  addSongToPlaylist(id: string, song: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/songs`, {
      song
    });
  }
}
