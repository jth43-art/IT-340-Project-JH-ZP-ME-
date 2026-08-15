import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioPlayerComponent],
  templateUrl: './app.component.html'
})
export class App {
  currentSong: any = null;

  // Called from any child page/view to load a song into the persistent audio player
  playSong(song: any): void {
    this.currentSong = song;
  }
}
