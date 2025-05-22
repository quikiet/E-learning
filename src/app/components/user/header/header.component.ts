import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { Divider } from 'primeng/divider';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-header',
  imports: [BadgeModule, RouterLink, Divider, InputIcon, IconField, InputTextModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  navBarToggle: boolean = false;
  dropdownOpen: boolean = false;
  currentUser: any = [];
  isLoggedIn = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getCurrentStudent().subscribe({
      next: (res) => {
        this.currentUser = res.user;
        this.isLoggedIn = true;
      }, error: (error) => {
        console.log(error.error);
      }
    });
  }

  logOut() {
    this.authService.logout().subscribe({
      next: (res) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
        console.log(res.message);
      }, error: (error) => {
        console.log(error.message);
      }
    })
  }

  toggleNavbar() {
    this.navBarToggle = !this.navBarToggle;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
