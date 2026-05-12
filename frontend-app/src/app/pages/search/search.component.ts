import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule], // 2. Add them here
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchQuery: string = '';
  songs: any[] = [];

  constructor(private searchService: SearchService) {}

  onSearch() {
    if (!this.searchQuery) return;

    this.searchService.searchSongs(this.searchQuery).subscribe({
      next: (res) => {
        // Jackson returns { results: [...] }
        this.songs = res.results;
      },
      error: (err) => alert("Search failed. Is Jackson's VM up?")
    });
  }

  addToPlaylist(song: any) {
    console.log('Adding to playlist:', song);
    // Later, we will call this.playlistService.addToPlaylist(song) here
    alert(`Added ${song.title} to your library!`);
  }
}