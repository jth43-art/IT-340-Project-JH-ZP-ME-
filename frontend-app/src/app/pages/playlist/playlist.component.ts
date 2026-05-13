import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistComponent implements OnInit {
  // Your backend IP address
  private apiUrl = 'http://100.105.95.54:3000'; 

  constructor(private http: HttpClient) { }

  /**
   * Helper to create the Authorization Header
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Fetches all playlists. 
   * Adding headers here fixes the "401 Unauthorized" error.
   */
  getPlaylists(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/playlists`, { headers });
  }

  /**
   * Creates a new playlist
   */
  createPlaylist(name: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/playlists`, { name }, { headers });
  }

  /**
   * Deletes a playlist by ID
   */
  deletePlaylist(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.apiUrl}/playlists/${id}`, { headers });
  }

  /**
   * Updates a playlist (used for removing/adding songs)
   */
  updatePlaylist(id: string, playlistData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/playlists/${id}`, playlistData, { headers });
  }
}
