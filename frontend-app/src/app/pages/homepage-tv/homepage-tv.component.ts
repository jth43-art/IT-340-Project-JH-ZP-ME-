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
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './homepage-tv.component.html',
  styleUrl: './homepage-tv.component.css'
})
export class HomepageTvComponent implements OnInit {

  username: string = '';
  role: string = '';
  mfaEnabled: boolean = false;

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

    // Prevent SSR/localStorage errors
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('user');

    // Redirect if user is not logged in
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userData);

    this.username =
      user.username || 'User';

    this.role =
      user.role || 'user';

    this.mfaEnabled =
      user.mfaEnabled || false;

    console.log(
      'Current User:',
      user
    );
  }

  // ==========================================
  // PLAYLIST MODAL
  // ==========================================

  openCreateModal(): void {
    this.showModal = true;
  }

  closeModal(): void {

    this.showModal = false;
    this.newPlaylistName = '';

  }

  savePlaylist(): void {

    if (!this.newPlaylistName.trim()) {
      return;
    }

    this.playlistService
      .createPlaylist(
        this.newPlaylistName
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Playlist created!',
            res
          );

          alert(
            'Playlist Created Successfully!'
          );

          this.closeModal();

        },

        error: (err: any) => {

          console.error(
            'Error creating playlist',
            err
          );

        }

      });
  }

  // ==========================================
  // MFA SETTINGS
  // ==========================================

  manageMfa(): void {

    // MFA is currently disabled.
    // Send user to the setup / QR page.
    if (!this.mfaEnabled) {

      this.router.navigate([
        '/mfa-setup'
      ]);

      return;
    }

    // MFA is currently enabled.
    // Confirm before disabling it.
    const confirmed = confirm(
      'Are you sure you want to disable Multi-Factor Authentication?'
    );

    if (!confirmed) {
      return;
    }

    this.authService
      .disableMfa()
      .subscribe({

        next: () => {

          this.mfaEnabled = false;

          const userData =
            localStorage.getItem('user');

          if (userData) {

            const user =
              JSON.parse(userData);

            user.mfaEnabled = false;

            localStorage.setItem(
              'user',
              JSON.stringify(user)
            );

          }

          alert(
            'Multi-Factor Authentication has been disabled.'
          );

        },

        error: (err: any) => {

          console.error(
            'Disable MFA error:',
            err
          );

          alert(
            err.error?.message ||
            'Unable to disable MFA.'
          );

        }

      });
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  onLogout(): void {

    console.log(
      'Logout button clicked!'
    );

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }
}
