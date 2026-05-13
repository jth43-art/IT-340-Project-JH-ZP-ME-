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
    this.errorMessage = '';

    this.playlistService.getPlaylists().subscribe({
      next: (data: any) => {
        this.playlists = data.playlists || data || [];

        if (this.selectedPlaylist) {
          const updatedPlaylist = this.playlists.find(
            (playlist: any) => playlist._id === this.selectedPlaylist._id
          );

          this.selectedPlaylist = updatedPlaylist || null;
        }

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Playlist load error:', err);
        this.errorMessage = 'Could not load playlists.';
        this.cdr.detectChanges();
      }
    });
  }

  createPlaylist(): void {
    if (!this.newPlaylistName.trim()) {
      return;
    }

    this.playlistService.createPlaylist(this.newPlaylistName).subscribe({
      next: () => {
        alert('Playlist Created!');

        this.newPlaylistName = '';
        this.showCreateBox = false;

        this.loadPlaylists();
      },

      error: (err: any) => {
        console.error('Create playlist error:', err);
        alert('Failed to create playlist');
      }
    });
  }

  openPlaylist(playlist: any): void {
    this.selectedPlaylist = playlist;
  }

  closePlaylist(): void {
    this.selectedPlaylist = null;
  }

  deletePlaylist(id: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!confirm('Delete this playlist?')) {
      return;
    }

    this.playlistService.deletePlaylist(id).subscribe({
      next: () => {
        alert('Playlist Deleted');

        this.selectedPlaylist = null;

        this.loadPlaylists();
      },

      error: (err: any) => {
        console.error('Delete playlist error:', err);
        alert('Failed to delete playlist');
      }
    });
  }

  removeSong(songIndex: number): void {
    if (!this.selectedPlaylist) {
      return;
    }

    this.selectedPlaylist.songs.splice(songIndex, 1);

    this.playlistService.updatePlaylist(
      this.selectedPlaylist._id,
      this.selectedPlaylist
    ).subscribe({
      next: () => {
        alert('Song Removed');
        this.loadPlaylists();
      },

      error: (err: any) => {
        console.error('Remove song error:', err);
        alert('Failed to remove song');
      }
    });
  }

  getPlaylistName(playlist: any): string {
    return playlist?.title || playlist?.name || 'Untitled Playlist';
  }

  getSongTitle(song: any): string {
    return song?.title || song?.track || 'Untitled Song';
  }

  getSongArtist(song: any): string {
    return song?.artist || 'Unknown Artist';
  }

  getSpotifyUrl(song: any): string {
    if (song?.externalLinks?.spotify) {
      return song.externalLinks.spotify;
    }

    const title = this.getSongTitle(song);
    const artist = this.getSongArtist(song);
    const query = encodeURIComponent(`${title} ${artist}`);

    return `https://open.spotify.com/search/${query}`;
  }

  playOnSpotify(song: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.open(this.getSpotifyUrl(song), '_blank');
  }
}
