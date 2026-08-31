import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private baseUrl = 'http://100.105.95.54:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  uploadSong(formData: FormData): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/api/upload/song`, formData, { headers });
  }
}
