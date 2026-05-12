import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PlaylistService } from '../../services/playlist.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-homepage-tv',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './homepage-tv.component.html',
  styleUrl: './homepage-tv.component.css'
})
export class HomepageTvComponent implements OnInit {
  username: string = '';
  role: string = '';
  showModal: boolean = false;
  newPlaylistName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private playlistService: PlaylistService,
    private searchService: SearchService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    // Prevent SSR/localStorage error
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('user');

    // Redirect if not logged in
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userData);

    this.username = user.username || 'User';
    this.role = user.role || 'user';

    console.log('Current User:', user);
  }

  openCreateModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newPlaylistName = '';
  }

  savePlaylist(): void {
    if (this.newPlaylistName.trim()) {

      this.playlistService.createPlaylist(this.newPlaylistName).subscribe({

        next: (res: any) => {
          console.log('Playlist created!', res);

          alert('Playlist Created Successfully!');

          this.closeModal();
        },

        error: (err: any) => {
          console.error('Error creating playlist', err);
        }

      });
    }
  }

  onLogout(): void {

    console.log('Logout button clicked!');

    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');

    this.authService.currentUser = '';
    this.authService.loggedInUser = '';

    this.router.navigate(['/login']);
  }
}
