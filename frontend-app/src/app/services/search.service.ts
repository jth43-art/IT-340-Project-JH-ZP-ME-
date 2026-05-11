import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = 'http://100.105.95.54:3000'; // Use Jackson's Tailscale IP

  constructor(private http: HttpClient) {}

  searchSongs(query: string): Observable<any> {
    // Jackson's route expects ?q=query
    return this.http.get(`${this.baseUrl}/search?q=${query}`);
  }
}