import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../services/playlist.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  allPlaylists: any[] = [];
  stats = { totalSongs: 0, totalUsers: 0 };

  constructor(private playlistService: PlaylistService, private router: Router) {}

  ngOnInit(): void {
    this.loadMasterData();
  }

  loadMasterData() {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {
        this.allPlaylists = data;
        // Simple math for the "Admin Stats"
        this.stats.totalSongs = data.reduce((sum, p) => sum + (p.songs?.length || 0), 0);
        // Set a dummy number or unique owner count if backend provides it
        this.stats.totalUsers = new Set(data.map(p => p.owner)).size;
      },
      error: (err) => console.error('Admin Fetch Error:', err)
    });
  }

  deleteAnyPlaylist(id: string) {
    if(confirm("Admin Warning: Are you sure you want to delete this user's playlist?")) {
      // call your service delete method here
      console.log('Deleting playlist:', id);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
