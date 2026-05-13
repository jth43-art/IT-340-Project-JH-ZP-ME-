import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SearchService } from '../../services/search.service';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  songs: any[] = [];
  playlists: any[] = [];

  constructor(
    private searchService: SearchService,
    private playlistService: PlaylistService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('user');

    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (res: any) => {
        this.playlists = res.playlists || res || [];
        console.log('Playlists loaded for search:', this.playlists);
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Playlist Load Error:', err);
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.searchService.searchSongs(this.searchQuery).subscribe({
      next: (res: any) => {
        this.songs = res.results || res || [];
        console.log('Search results:', this.songs);
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Search Error:', err);
      }
    });
  }

  addToPlaylist(song: any, playlistId: string): void {
    if (!playlistId) {
      alert('Please select a playlist first.');
      return;
    }

    this.playlistService.addSongToPlaylist(playlistId, song).subscribe({
      next: (res: any) => {
        console.log('Song added response:', res);
        alert('Song added to playlist!');
        this.loadPlaylists();
      },

      error: (err: any) => {
        console.error('Add song error:', err);
        alert('Failed to add song');
      }
    });
  }
}
