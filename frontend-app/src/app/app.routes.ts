import { Routes } from '@angular/router';
import LoginComponent from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomepageTvComponent } from './pages/homepage-tv/homepage-tv.component';
import { SearchComponent } from './pages/search/search.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';

export const routes: Routes = [
  // 1. Authentication Paths
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 2. Main Features
  { path: 'homepage-tv', component: HomepageTvComponent },
  { path: 'search', component: SearchComponent },
  { path: 'playlists', component: PlaylistComponent },

  // 3. Default Redirect
  // If the user goes to just "localhost:4200", send them to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // 4. Wildcard (Optional)
  // If they type a wrong URL, send them home
  { path: '**', redirectTo: '/login' }
];
