import { 
  Component, 
  Input, 
  OnChanges, 
  SimpleChanges, 
  Inject, 
  PLATFORM_ID 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css'
})
export class AudioPlayerComponent implements OnChanges {
  // Alias input to accept [song] from app.component.html
  @Input() song: any = null;
  @Input() currentSong: any = null;

  private audio: HTMLAudioElement | null = null;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 0.8;
  isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Only instantiate the browser Audio API on the client side
    if (this.isBrowser) {
      this.audio = new Audio();
      this.audio.volume = this.volume;

      this.audio.ontimeupdate = () => {
        this.currentTime = this.audio?.currentTime || 0;
      };

      this.audio.onloadedmetadata = () => {
        this.duration = this.audio?.duration || 0;
      };

      this.audio.onended = () => {
        this.isPlaying = false;
        this.currentTime = 0;
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Sync song input to currentSong if passed as [song]
    if (changes['song'] && this.song) {
      this.currentSong = this.song;
    }

    if ((changes['currentSong'] || changes['song']) && this.currentSong && this.isBrowser) {
      this.loadAndPlay();
    }
  }

  loadAndPlay(): void {
    if (!this.audio) return;

    const activeTrack = this.currentSong || this.song;
    if (!activeTrack) return;

    const streamUrl = activeTrack.streamUrl || 
                      activeTrack.url || 
                      `http://100.105.95.54:3000/songs/stream/${activeTrack._id || activeTrack.id}`;

    this.audio.src = streamUrl;
    this.audio.load();
    this.audio.play()
      .then(() => this.isPlaying = true)
      .catch((err) => console.error('Audio playback error:', err));
  }

  togglePlay(): void {
    if (!this.audio || !this.audio.src) return;

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  onSeek(event: Event): void {
    if (!this.audio) return;
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);
    this.audio.currentTime = time;
    this.currentTime = time;
  }

  onVolumeChange(event: Event): void {
    if (!this.audio) return;
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
