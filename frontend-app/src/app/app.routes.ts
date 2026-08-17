import { Routes } from '@angular/router';

import LoginComponent from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomepageTvComponent } from './pages/homepage-tv/homepage-tv.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SearchComponent } from './pages/search/search.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { MusicLibraryComponent } from './pages/music-library/music-library.component';
import MfaVerifyComponent from './pages/mfa-verify/mfa-verify.component';
import MfaSetupComponent from './pages/mfa-setup/mfa-setup.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'mfa-verify', component: MfaVerifyComponent },

  { path: 'mfa-setup', component: MfaSetupComponent },

  { path: 'homepage-tv', component: HomepageTvComponent },

  { path: 'admin-dashboard', component: AdminDashboardComponent },

  { path: 'search', component: SearchComponent },

  { path: 'playlists', component: PlaylistComponent },

  { path: 'music-library', component: MusicLibraryComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' }
];
