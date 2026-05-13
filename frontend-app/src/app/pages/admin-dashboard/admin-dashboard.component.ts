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

import { Router, RouterModule } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  allPlaylists: any[] = [];
  selectedPlaylist: any = null;

  stats = {
    totalSongs: 0,
    totalUsers: 0
  };

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

    const user = JSON.parse(userData);

    if (user.role !== 'admin') {
      this.router.navigate(['/homepage-tv']);
      return;
    }

    setTimeout(() => {
      this.loadMasterData();
    }, 0);
  }

  loadMasterData(): void {
    this.playlistService.getAdminPlaylists().subscribe({
      next: (response: any) => {
        console.log('Admin data received from server:', response);

        const data = Array.isArray(response)
          ? response
          : response.playlists || [];

        this.allPlaylists = data;

        if (this.selectedPlaylist) {
          const updatedPlaylist = this.allPlaylists.find(
            (playlist: any) => playlist._id === this.selectedPlaylist._id
          );

          this.selectedPlaylist = updatedPlaylist || null;
        }

        this.stats.totalSongs = data.reduce(
          (sum: number, p: any) => sum + (p.songs?.length || 0),
          0
        );

        this.stats.totalUsers = new Set(
          data.map((p: any) => p.owner?._id || p.owner)
        ).size;

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('The server rejected the Admin request:', err);

        this.allPlaylists = [];
        this.selectedPlaylist = null;

        this.stats.totalSongs = 0;
        this.stats.totalUsers = 0;

        this.cdr.detectChanges();
      }
    });
  }

  openPlaylist(playlist: any): void {
    this.selectedPlaylist = playlist;
  }

  closePlaylist(): void {
    this.selectedPlaylist = null;
  }

  getSongTitle(song: any): string {
    return song?.title || song?.track || 'Untitled Song';
  }

  getSongArtist(song: any): string {
    return song?.artist || 'Unknown Artist';
  }

  getPlaylistTitle(playlist: any): string {
    return playlist?.title || playlist?.name || 'Untitled Playlist';
  }

  getSpotifyUrl(song: any): string {
    const title = this.getSongTitle(song);
    const artist = this.getSongArtist(song);

    return (
      song?.url ||
      song?.spotifyUrl ||
      song?.externalLinks?.spotify ||
      `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`
    );
  }

  playOnSpotify(song: any): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const spotifyUrl = this.getSpotifyUrl(song);

    window.open(spotifyUrl, '_blank');
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
        alert('Song removed.');
        this.loadMasterData();
      },

      error: (err: any) => {
        console.error('Failed to remove song:', err);
        alert('Failed to remove song.');
      }
    });
  }

  deleteAnyPlaylist(id: string): void {
    const confirmed = confirm(
      "Admin Warning: Are you sure you want to delete this user's playlist?"
    );

    if (!confirmed) {
      return;
    }

    this.playlistService.deletePlaylist(id).subscribe({
      next: () => {
        alert('Playlist deleted by admin.');

        this.selectedPlaylist = null;

        this.loadMasterData();
      },

      error: (err: any) => {
        console.error('Admin delete failed:', err);
        alert('Failed to delete playlist.');
      }
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }

    this.router.navigate(['/login']);
  }
}
