import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = 'http://100.105.95.54:3000';

  constructor(private http: HttpClient) {}

  // Hits Jackson's app.get('/search')
  searchSongs(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?q=${query}`);
  }

  // Hits Jackson's app.get('/now-playing')
  getNowPlaying(): Observable<any> {
    return this.http.get(`${this.baseUrl}/now-playing`);
  }
}