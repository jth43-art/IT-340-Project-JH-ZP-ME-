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
      next: (data: any[]) => {
        console.log('Data received from server:', data); // Debugging line
        this.allPlaylists = data;
        // Fixes TS7006 by adding types (sum: number, p: any)
        if (data && data.length > 0) {
        this.stats.totalSongs = data.reduce((sum: number, p: any) => sum + (p.songs?.length || 0), 0);
        this.stats.totalUsers = new Set(data.map((p: any) => p.owner)).size;
      }
    },
    error: (err) => {
      console.error('The server rejected the Admin request:', err);
      // This is likely where your 401 error is being caught now
    }
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
