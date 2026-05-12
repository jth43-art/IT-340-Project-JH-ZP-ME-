import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.playlistService.getPlaylists().subscribe({

      next: (data) => {
        this.playlists = data.playlists || [];
        console.log('Playlists loaded:', this.playlists);
      },

      error: (err) => {
        this.errorMessage = 'Could not load playlists.';
        console.error(err);
      }
    });
  }

  createPlaylist() {

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

      error: (err) => {
        console.error(err);
        alert('Failed to create playlist');
      }
    });
  }

  deletePlaylist(id: string) {

    const confirmed = confirm('Delete this playlist?');

    if (!confirmed) return;

    this.playlistService.deletePlaylist(id).subscribe({

      next: () => {
        alert('Playlist Deleted');
        this.loadPlaylists();
      },

      error: (err) => {
        console.error(err);
        alert('Failed to delete playlist');
      }
    });
  }

  openPlaylist(playlist: any) {
    this.selectedPlaylist = playlist;
  }

  closePlaylist() {
    this.selectedPlaylist = null;
  }

  removeSong(songIndex: number) {

    if (!this.selectedPlaylist) return;

    this.selectedPlaylist.songs.splice(songIndex, 1);

    this.playlistService.updatePlaylist(
      this.selectedPlaylist._id,
      this.selectedPlaylist
    ).subscribe({

      next: () => {
        alert('Song Removed');
        this.loadPlaylists();
      },

      error: (err) => {
        console.error(err);
        alert('Failed to remove song');
      }
    });
  }
}
