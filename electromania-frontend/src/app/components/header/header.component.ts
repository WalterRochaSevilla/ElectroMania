import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/productos'], { queryParams: { q: this.searchTerm } });
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
