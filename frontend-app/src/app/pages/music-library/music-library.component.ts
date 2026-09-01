import {
  Component,
  OnInit,
  OnDestroy
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
export class MusicLibraryComponent
  implements OnInit, OnDestroy {

  songs: any[] = [];
  playlists: any[] = [];

  loading = true;
  errorMessage = '';

  playingSongId: string | null = null;

  private currentAudio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    this.fetchSongs();
    this.loadPlaylists();
  }

  // ========================================
  // LOAD MUSIC LIBRARY
  // ========================================

  fetchSongs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.songService.getSongs().subscribe({
      next: (data: any) => {

        this.songs =
          Array.isArray(data)
            ? data
            : (data.songs || []);

        this.loading = false;
      },

      error: (err: any) => {
        console.error(
          'Error fetching songs:',
          err
        );

        this.errorMessage =
          err.error?.message ||
          'Failed to load music library.';

        this.loading = false;
      }
    });
  }

  // ========================================
  // LOAD USER PLAYLISTS
  // ========================================

  loadPlaylists(): void {
    this.playlistService
      .getPlaylists()
      .subscribe({

        next: (data: any) => {

          this.playlists =
            data.playlists ||
            data ||
            [];

        },

        error: (err: any) => {
          console.error(
            'Playlist load error:',
            err
          );
        }
      });
  }

  // ========================================
  // PLAY UPLOADED MP3
  // ========================================

  playSong(song: any): void {

    if (!song?._id) {
      this.errorMessage =
        'Unable to play this song.';
      return;
    }

    this.errorMessage = '';

    // If this song is already playing,
    // stop it.
    if (
      this.playingSongId === song._id &&
      this.currentAudio
    ) {
      this.stopCurrentSong();
      return;
    }

    // Stop anything currently playing
    this.stopCurrentSong();

    this.songService
      .streamSong(song._id)
      .subscribe({

        next: (audioBlob: Blob) => {

          const objectUrl =
            URL.createObjectURL(audioBlob);

          const audio =
            new Audio(objectUrl);

          this.currentObjectUrl =
            objectUrl;

          this.currentAudio =
            audio;

          this.playingSongId =
            song._id;

          audio.play().catch(err => {

            console.error(
              'Audio playback error:',
              err
            );

            this.errorMessage =
              'Unable to play this MP3.';

            this.stopCurrentSong();
          });

          audio.onended = () => {
            this.stopCurrentSong();
          };
        },

        error: (err: any) => {

          console.error(
            'Stream error:',
            err
          );

          this.errorMessage =
            err.error?.message ||
            'Unable to stream this song.';
        }
      });
  }

  // ========================================
  // STOP PLAYBACK
  // ========================================

  stopCurrentSong(): void {

    if (this.currentAudio) {

      this.currentAudio.pause();

      this.currentAudio.currentTime = 0;

      this.currentAudio = null;
    }

    if (this.currentObjectUrl) {

      URL.revokeObjectURL(
        this.currentObjectUrl
      );

      this.currentObjectUrl = null;
    }

    this.playingSongId = null;
  }

  // ========================================
  // ADD UPLOADED SONG TO PLAYLIST
  // ========================================

  addToPlaylist(
    song: any,
    playlistId: string
  ): void {

    if (!playlistId) {
      alert(
        'Please select a playlist first.'
      );

      return;
    }

    const playlistSong = {
      ...song,

      source: 'upload',

      title:
        song.title ||
        'Untitled Song',

      artist:
        song.artist ||
        'Unknown Artist',

      artworkUrl:
        song.albumArtworkPath ||
        '',

      filePath:
        song.filePath ||
        ''
    };

    this.playlistService
      .addSongToPlaylist(
        playlistId,
        playlistSong
      )
      .subscribe({

        next: () => {

          alert(
            'Song added to playlist!'
          );

          this.loadPlaylists();
        },

        error: (err: any) => {

          console.error(
            'Add to playlist error:',
            err
          );

          alert(
            err.error?.message ||
            'Failed to add song to playlist.'
          );
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
