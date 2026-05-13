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
  errorMessage: string = '';

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
        this.errorMessage = 'Could not load playlists.';
        this.cdr.detectChanges();
      }
    });
  }

  private hasSuspiciousInput(value: string): boolean {
    const blockedPattern = /(\$|{|}|\[|\]|;|<|>|`|"|'|--)/;

    return blockedPattern.test(value);
  }

  onSearch(): void {
    this.errorMessage = '';

    const query = this.searchQuery.trim();

    if (!query) {
      this.errorMessage = 'Please enter a search term.';
      this.songs = [];
      return;
    }

    if (query.length > 60) {
      this.errorMessage = 'Search term is too long. Please use 60 characters or less.';
      this.songs = [];
      return;
    }

    if (this.hasSuspiciousInput(query)) {
      this.errorMessage = 'Search contains invalid characters.';
      this.songs = [];
      return;
    }

    this.searchService.searchSongs(query).subscribe({
      next: (res: any) => {
        this.songs = res.results || res || [];

        if (this.songs.length === 0) {
          this.errorMessage = 'No songs found.';
        }

        console.log('Search results:', this.songs);
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Search Error:', err);
        this.errorMessage = err.error?.message || 'Search failed. Please try again.';
        this.songs = [];
        this.cdr.detectChanges();
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
