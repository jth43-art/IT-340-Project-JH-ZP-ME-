import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {

    this.playlistService.getPlaylists().subscribe({

      next: (res) => {
        this.playlists = res.playlists || [];
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  onSearch() {

    if (!this.searchQuery.trim()) return;

    this.searchService.searchSongs(this.searchQuery).subscribe({

      next: (res) => {
        this.songs = res.results || [];
      },

      error: (err) => {
        console.error('Search Error:', err);
      }
    });
  }

  addToPlaylist(song: any, playlistId: string) {

    this.playlistService.addSongToPlaylist(playlistId, song).subscribe({

      next: () => {
        alert('Song added to playlist!');
      },

      error: (err) => {
        console.error(err);
        alert('Failed to add song');
      }
    });
  }
}
