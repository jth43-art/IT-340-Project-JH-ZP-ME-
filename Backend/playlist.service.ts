import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private baseUrl = 'http://localhost:3000/api/playlists';

  constructor(private http: HttpClient) {}

  getPlaylists(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createPlaylist(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  updatePlaylist(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deletePlaylist(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
