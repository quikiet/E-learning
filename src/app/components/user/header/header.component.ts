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
  token: string = '';
  user: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? '';
    this.user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.isLoggedIn();
  }

  isLoggedIn() {
    if (this.token && this.user.id) {
      return true;
    }
    return false;
  }

  logOut() {
    this.authService.logout().subscribe({
      next: (res) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
