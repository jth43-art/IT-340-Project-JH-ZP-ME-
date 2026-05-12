import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  showModal: boolean = false;
  newPlaylistName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private playlistService: PlaylistService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.username = this.username || this.authService.loggedInUser || 'Guest';
    console.log('Current User:', this.username);
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
