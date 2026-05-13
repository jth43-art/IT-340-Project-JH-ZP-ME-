import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  allPlaylists: any[] = [];
  stats = {
    totalSongs: 0,
    totalUsers: 0
  };

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userData = localStorage.getItem('user');

    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userData);

    if (user.role !== 'admin') {
      this.router.navigate(['/homepage-tv']);
      return;
    }

    setTimeout(() => {
      this.loadMasterData();
    }, 0);
  }

  loadMasterData(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (response: any) => {
        console.log('Admin data received from server:', response);

        const data = Array.isArray(response)
          ? response
          : response.playlists || [];

        this.allPlaylists = data;

        this.stats.totalSongs = data.reduce(
          (sum: number, p: any) => sum + (p.songs?.length || 0),
          0
        );

        this.stats.totalUsers = new Set(
          data.map((p: any) => p.owner?._id || p.owner)
        ).size;

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('The server rejected the Admin request:', err);

        this.allPlaylists = [];
        this.stats.totalSongs = 0;
        this.stats.totalUsers = 0;

        this.cdr.detectChanges();
      }
    });
  }

  deleteAnyPlaylist(id: string): void {
    const confirmed = confirm(
      "Admin Warning: Are you sure you want to delete this user's playlist?"
    );

    if (!confirmed) {
      return;
    }

    this.playlistService.deletePlaylist(id).subscribe({
      next: () => {
        alert('Playlist deleted by admin.');
        this.loadMasterData();
      },

      error: (err: any) => {
        console.error('Admin delete failed:', err);
        alert('Failed to delete playlist.');
      }
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }

    this.router.navigate(['/login']);
  }
}
