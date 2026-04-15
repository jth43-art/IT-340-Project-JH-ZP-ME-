// src/app/services/tunevault.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TuneVaultService {

  private API_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // NOW PLAYING
  getNowPlaying(): Observable<any> {
    return this.http.get(`${this.API_URL}/now-playing`);
  }

  // RECENT SONGS
  getRecentSongs(): Observable<any> {
    return this.http.get(`${this.API_URL}/recent`);
  }

  // PLAYLISTS
  getPlaylists(): Observable<any> {
    return this.http.get(`${this.API_URL}/playlists`);
  }

  // SEARCH
  searchLibrary(query: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search?q=${query}`);
  }
}
