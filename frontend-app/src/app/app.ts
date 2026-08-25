import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AudioPlayerComponent } from './pages/audio-player/audio-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    AudioPlayerComponent
  ],
  templateUrl: './app.component.html'
})
export class App {
  currentSong: any = null;

  playSong(song: any): void {
    this.currentSong = song;
  }
}
