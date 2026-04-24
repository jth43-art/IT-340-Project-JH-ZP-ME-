
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage-tv',
  // imports: [RouterLink],
  templateUrl: './homepage-tv.component.html',
  styleUrl: './homepage-tv.css'
})
export class HomepageTvComponent {

  // 2. Make sure 'private router: Router' is inside the parentheses
  constructor(private router: Router) { }

  // 3. Ensure this name matches the (click) in HTML
  logout() {
    console.log("Logout button clicked!"); // Add this to test in F12 console
    this.router.navigate(['/login']);
  }
}
