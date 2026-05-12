import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage-tv',
  templateUrl: './homepage-tv.component.html',
  styleUrl: './homepage-tv.component.css'
})
export class HomepageTvComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.username = this.authService.loggedInUser || 'Guest';
    console.log('Current User:', this.username); // Add this line to check the username in the console
  }

  // 3. Ensure this name matches the (click) in HTML
  onLogout() {
    console.log("Logout button clicked!"); // Add this to test in F12 console
    localStorage.removeItem('username'); // Clear username from localStorage
    this.authService.currentUser = ''; // Clear the currentUser variable in AuthService
    this.router.navigate(['/login']);
  }
}
