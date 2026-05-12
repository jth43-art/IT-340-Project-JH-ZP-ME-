import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  searchQuery: string = '';
  songs: any[] = [];

  constructor(private searchService: SearchService) {}

  onSearch() {
    if (!this.searchQuery.trim()) return;

    this.searchService.searchSongs(this.searchQuery).subscribe({
      next: (res) => {
        // Jackson backend should return:
        // { results: [...] }

        this.songs = res.results || [];

        console.log('Search results:', this.songs);
      },

      error: (err) => {
        console.error('Search Error:', err);

        // temporary fallback demo data
        this.songs = [
          {
            title: 'Backend Offline Demo Song',
            artist: 'TuneVault'
          }
        ];

        alert("Search backend offline. Showing demo data.");
      }
    });
  }

  addToPlaylist(song: any) {
    console.log('Added to playlist:', song);

    // placeholder until playlist backend is connected
    alert(`${song.title} added to playlist`);
  }
}
