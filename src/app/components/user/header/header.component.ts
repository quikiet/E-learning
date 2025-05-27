import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { Divider } from 'primeng/divider';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/courses-manage/category.service';
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
  userRole: string = '';
  categories: any = {};
  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.categories = res;
      }, error: (err) => {
        console.log(err.message);
      }
    })
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res.user;
        this.userRole = this.currentUser.role;
      }, error: (error) => {
        console.log(error.error);
      }
    });
  }

  logOut() {
    this.authService.logout().subscribe({
      next: (res) => {
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
