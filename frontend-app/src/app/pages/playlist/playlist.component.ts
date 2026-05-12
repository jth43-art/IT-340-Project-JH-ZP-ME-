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

    setTimeout(() => {
      this.loadPlaylists();
    }, 0);
  }

  loadPlaylists(): void {
    this.errorMessage = '';

    this.playlistService.getPlaylists().subscribe({
      next: (data: any) => {
        this.playlists = data.playlists || [];
        console.log('Playlists loaded:', this.playlists);

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        this.errorMessage = 'Could not load playlists.';
        console.error(err);

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
        console.error(err);
        alert('Failed to create playlist');
      }
    });
  }

  deletePlaylist(id: string): void {
    const confirmed = confirm('Delete this playlist?');

    if (!confirmed) {
      return;
    }

    this.playlistService.deletePlaylist(id).subscribe({
      next: () => {
        alert('Playlist Deleted');

        this.selectedPlaylist = null;
        this.loadPlaylists();
      },

      error: (err: any) => {
        console.error(err);
        alert('Failed to delete playlist');
      }
    });
  }

  openPlaylist(playlist: any): void {
    this.selectedPlaylist = playlist;
  }

  closePlaylist(): void {
    this.selectedPlaylist = null;
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
        console.error(err);
        alert('Failed to remove song');
      }
    });
  }
}
