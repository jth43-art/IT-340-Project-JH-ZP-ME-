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
      next: (response: any) => {
  console.log('Data received from server:', response);

  // This line is the safety net: 
  // If response is an array, use it. If it has a .playlists property, use that.
  const data = Array.isArray(response) ? response : (response.playlists || []);
  
  this.allPlaylists = data;

  if (data && data.length > 0) {
    // 1. Calculate total songs across all playlists
    this.stats.totalSongs = data.reduce((sum: number, p: any) => sum + (p.songs?.length || 0), 0);
    
    // 2. Count unique owners to see how many active users there are
    this.stats.totalUsers = new Set(data.map((p: any) => p.owner)).size;
  } else {
    // Reset to zero if no data actually came back
    this.stats.totalSongs = 0;
    this.stats.totalUsers = 0;
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
