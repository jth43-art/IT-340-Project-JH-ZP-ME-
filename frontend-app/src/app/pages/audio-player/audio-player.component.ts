import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css'
})
export class AudioPlayerComponent implements OnChanges {
  @Input() currentSong: any = null;

  private audio = new Audio();
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 0.8;

  constructor() {
    this.audio.volume = this.volume;

    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio.currentTime || 0;
    };

    this.audio.onloadedmetadata = () => {
      this.duration = this.audio.duration || 0;
    };

    this.audio.onended = () => {
      this.isPlaying = false;
      this.currentTime = 0;
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSong'] && this.currentSong) {
      this.loadAndPlay();
    }
  }

  loadAndPlay(): void {
    const streamUrl = this.currentSong.streamUrl || 
                      this.currentSong.url || 
                      `http://100.105.95.54:3000/songs/stream/${this.currentSong._id || this.currentSong.id}`;

    this.audio.src = streamUrl;
    this.audio.load();
    this.audio.play()
      .then(() => this.isPlaying = true)
      .catch((err) => console.error('Audio playback error:', err));
  }

  togglePlay(): void {
    if (!this.audio.src) return;

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);
    this.audio.currentTime = time;
    this.currentTime = time;
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const vol = parseFloat(input.value);
    this.volume = vol;
    this.audio.volume = vol;
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
