import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent implements OnInit {
  playlists: any[] = [];
  errorMessage: string = '';
  showCreateBox: boolean = false;
  newPlaylistName: string = '';
  selectedPlaylist: any = null;

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.errorMessage = '';
    this.playlistService.getPlaylists().subscribe({
      next: (data: any) => {
        this.playlists = data.playlists || data || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = 'Could not load playlists.';
        this.cdr.detectChanges();
      }
    });
  }

  // NEW METHOD: Opens Spotify Search in a new tab
  playOnSpotify(song: any): void {
    const title = song.track || song.title || 'Unknown Song';
    const artist = song.artist || '';
    const query = encodeURIComponent(`${title} ${artist}`);
    const spotifyUrl = `https://open.spotify.com/search/${query}`;
    window.open(spotifyUrl, '_blank');
  }

  createPlaylist(): void {
    if (!this.newPlaylistName.trim()) return;
    this.playlistService.createPlaylist(this.newPlaylistName).subscribe({
      next: () => {
        alert('Playlist Created!');
        this.newPlaylistName = '';
        this.showCreateBox = false;
        this.loadPlaylists();
      },
      error: () => alert('Failed to create playlist')
    });
  }

  deletePlaylist(id: string): void {
    if (!confirm('Delete this playlist?')) return;
    this.playlistService.deletePlaylist(id).subscribe({
      next: () => {
        alert('Playlist Deleted');
        this.selectedPlaylist = null;
        this.loadPlaylists();
      },
      error: () => alert('Failed to delete playlist')
    });
  }

  openPlaylist(playlist: any): void {
    this.selectedPlaylist = playlist;
  }

  closePlaylist(): void {
    this.selectedPlaylist = null;
  }

  removeSong(songIndex: number): void {
    if (!this.selectedPlaylist) return;
    this.selectedPlaylist.songs.splice(songIndex, 1);
    this.playlistService.updatePlaylist(this.selectedPlaylist._id, this.selectedPlaylist).subscribe({
      next: () => {
        alert('Song Removed');
        this.loadPlaylists();
      },
      error: () => alert('Failed to remove song')
    });
  }
}
