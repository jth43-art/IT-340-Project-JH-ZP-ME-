import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl = 'http://100.105.95.54:3000';

  constructor(private http: HttpClient) {}

  sanitizeQuery(query: string): string {

    return query
      .trim()

      // Remove Mongo operators and dangerous characters
      .replace(/\$/g, '')
      .replace(/[{}[\];<>]/g, '')
      .replace(/['"`]/g, '')

      // Prevent multiple spaces
      .replace(/\s+/g, ' ')

      // Limit query length
      .substring(0, 60);
  }

  searchSongs(query: string): Observable<any> {

    const cleanQuery = this.sanitizeQuery(query);

    return this.http.get(
      `${this.baseUrl}/search?query=${encodeURIComponent(cleanQuery)}`
    );
  }

  getNowPlaying(): Observable<any> {
    return this.http.get(`${this.baseUrl}/now-playing`);
  }
}
