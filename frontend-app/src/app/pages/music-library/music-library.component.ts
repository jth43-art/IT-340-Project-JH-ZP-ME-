import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-music-library',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './music-library.component.html',
  styleUrl: './music-library.component.css'
})
export class MusicLibraryComponent implements OnInit, OnDestroy {
  songs: any[] = [];
  playlists: any[] = [];

  loading = true;
  errorMessage = '';
  playingSongId: string | null = null;

  private currentAudio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchSongs();
    this.loadPlaylists();
  }

  // ========================================
  // LOAD UPLOADED SONGS
  // ========================================
  fetchSongs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.songService.getSongs().subscribe({
      next: (data: any) => {
        this.songs = Array.isArray(data) ? data : (data.songs || []);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching songs:', err);
        this.errorMessage = err.error?.message || 'Failed to load music library.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ========================================
  // LOAD PLAYLISTS
  // ========================================
  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (data: any) => {
        this.playlists = Array.isArray(data) ? data : (data.playlists || []);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Playlist load error:', err);
        this.cdr.detectChanges();
      }
    });
  }

  // ========================================
  // PLAY UPLOADED MP3
  // ========================================
  playSong(song: any): void {
    const songId = song?._id || song?.id;

    if (!songId) {
      this.errorMessage = 'Unable to play this song.';
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';

    // Clicking the currently playing song stops it
    if (this.playingSongId === songId && this.currentAudio) {
      this.stopCurrentSong();
      return;
    }

    // Stop previous song before starting another
    this.stopCurrentSong();

    this.songService.streamSong(songId).subscribe({
      next: (audioBlob: Blob) => {
        const objectUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(objectUrl);

        this.currentObjectUrl = objectUrl;
        this.currentAudio = audio;
        this.playingSongId = songId;

        this.cdr.detectChanges();

        audio.play().catch(err => {
          console.error('Audio playback error:', err);
          this.errorMessage = 'Unable to play this MP3.';
          this.stopCurrentSong();
          this.cdr.detectChanges();
        });

        audio.onended = () => {
          this.stopCurrentSong();
          this.cdr.detectChanges();
        };
      },
      error: (err: any) => {
        console.error('Stream error:', err);
        this.errorMessage = err.error?.message || 'Unable to stream this song.';
        this.cdr.detectChanges();
      }
    });
  }

  // ========================================
  // STOP CURRENT SONG
  // ========================================
  stopCurrentSong(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }

    this.playingSongId = null;
    this.cdr.detectChanges();
  }

  // ========================================
  // ADD SONG TO PLAYLIST
  // ========================================
  addToPlaylist(song: any, playlistId: string): void {
    if (!playlistId) {
      alert('Please select a playlist first.');
      return;
    }

    const playlistSong = {
      ...song,
      songId: song._id || song.id,
      source: 'upload',
      title: song.title || song.track || 'Untitled Song',
      artist: song.artist || 'Unknown Artist',
      artworkUrl: song.albumArtwork || song.albumArtworkPath || song.coverUrl || '',
      filePath: song.filePath || ''
    };

    this.playlistService.addSongToPlaylist(playlistId, playlistSong).subscribe({
      next: () => {
        alert(`"${playlistSong.title}" added to playlist!`);
        this.loadPlaylists();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Add to playlist error:', err);
        alert(err.error?.message || 'Failed to add song to playlist.');
        this.cdr.detectChanges();
      }
    });
  }

  // ========================================
  // CLEANUP
  // ========================================
  ngOnDestroy(): void {
    this.stopCurrentSong();
  }
}
