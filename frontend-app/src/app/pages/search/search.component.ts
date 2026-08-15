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
import { App } from '../../app';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  selectedFilter: string = 'all'; // Filters: all, title, artist, album, genre
  allSongs: any[] = [];
  songs: any[] = [];
  playlists: any[] = [];
  errorMessage: string = '';

  constructor(
    private searchService: SearchService,
    private playlistService: PlaylistService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private appRoot: App,
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
      this.allSongs = [];
      return;
    }

    if (query.length > 60) {
      this.errorMessage = 'Search term is too long. Please use 60 characters or less.';
      this.songs = [];
      this.allSongs = [];
      return;
    }

    if (this.hasSuspiciousInput(query)) {
      this.errorMessage = 'Search contains invalid characters.';
      this.songs = [];
      this.allSongs = [];
      return;
    }

    this.searchService.searchSongs(query).subscribe({
      next: (res: any) => {
        this.allSongs = res.results || res || [];
        this.applyFilter();

        if (this.songs.length === 0) {
          this.errorMessage = 'No matching songs found.';
        }

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Search Error:', err);
        this.errorMessage = err.error?.message || 'Search failed. Please try again.';
        this.songs = [];
        this.allSongs = [];
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.songs = [...this.allSongs];
      return;
    }

    const queryLower = this.searchQuery.trim().toLowerCase();

    this.songs = this.allSongs.filter(song => {
      const value = (song[this.selectedFilter] || '').toString().toLowerCase();
      return value.includes(queryLower);
    });
  }

  playSong(song: any): void {
    this.appRoot.playSong(song);
  }

  addToPlaylist(song: any, playlistId: string): void {
    if (!playlistId) {
      alert('Please select a playlist first.');
      return;
    }

    this.playlistService.addSongToPlaylist(playlistId, song).subscribe({
      next: (res: any) => {
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
