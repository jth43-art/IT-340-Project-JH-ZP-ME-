import { Routes } from '@angular/router';
import LoginComponent from './pages/login/login.component';
import { HomepageTvComponent } from './pages/homepage-tv/homepage-tv.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SearchComponent } from './pages/search/search.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'homepage-tv', component: HomepageTvComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'search', component: SearchComponent },
  { path: 'playlists', component: PlaylistComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
