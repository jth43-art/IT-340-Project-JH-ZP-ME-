import { Routes } from '@angular/router';

// LoginComponent: Default export, no braces, relative path
import LoginComponent from './pages/login/login.component';

// Others: Named exports, with braces, relative paths
import { RegisterComponent } from './pages/register/register.component';
import { HomepageTvComponent } from './pages/homepage-tv/homepage-tv.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'homepage-tv', component: HomepageTvComponent }
];