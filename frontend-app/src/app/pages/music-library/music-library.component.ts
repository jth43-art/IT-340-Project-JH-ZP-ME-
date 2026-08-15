import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-music-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-library.component.html',
  styleUrl: './music-library.component.css'
})
export class MusicLibraryComponent implements OnInit {
  songs: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.fetchSongs();
  }

  fetchSongs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.songService.getSongs().subscribe({
      next: (data: any) => {
        // Handle array response or object wrapper
        this.songs = Array.isArray(data) ? data : (data.songs || []);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching songs:', err);
        this.errorMessage = 'Failed to load music library.';
        this.loading = false;
      }
    });
  }

  playSong(song: any): void {
    // Bridges to Spotify search or custom streaming
    const query = encodeURIComponent(`${song.title || song.track} ${song.artist || ''}`);
    window.open(`https://open.spotify.com/search/${query}`, '_blank');
  }
}
