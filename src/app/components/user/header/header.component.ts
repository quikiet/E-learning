import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CoursesService } from '../../../services/courses.service';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CustomAutocompleteComponent } from "../../both/custom-autocomplete/custom-autocomplete.component";
import { SkeletonModule } from 'primeng/skeleton';
import { AnimateOnScroll } from 'primeng/animateonscroll';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-header',
  imports: [PopoverModule, AnimateOnScroll, SkeletonModule, BadgeModule, RouterLink, InputTextModule, CommonModule, AutoCompleteModule, ButtonModule, FormsModule, CustomAutocompleteComponent],
  providers: [CoursesService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  navBarToggle: boolean = false;
  currentUser: any = [];
  userRole: string = '';
  categories: any = {};
  parentCategories: any[] = [];
  isLoading = true;
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
    this.isLoading = true;
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.parentCategories = res.filter((category: any) => category.parent_id === null);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching categories:', err.message);
      }
    });
  }

  getCurrentUser() {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res.user;
        this.isLoading = false;
        this.userRole = this.currentUser.role;
      }, error: (error) => {
        console.log(error.error);
        this.isLoading = false;
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

}
