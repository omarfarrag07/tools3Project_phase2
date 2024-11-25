import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Retrieve user role from local storage
    this.userRole = localStorage.getItem('userRole');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
