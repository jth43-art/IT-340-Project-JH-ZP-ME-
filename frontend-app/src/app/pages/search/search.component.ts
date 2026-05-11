import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
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
}