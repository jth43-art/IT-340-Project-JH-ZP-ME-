import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:3000/api/search';
  constructor(private http: HttpClient) {}
  searchMusic(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?query=${query}`);
  }
}
