import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink, BadgeModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  sidebarToggle: boolean = false;
  dropdownOpen: boolean = false;
  isDarkMode: boolean = false; // Mặc định là light mode
  isSidebarHovered: boolean = false;
  isUserManageOpen = false;
  isCourseManageOpen = false;
  isQuizManageOpen = false;
  isCertificateManageOpen = false;
  isReviewManageOpen = false;
  isPaymentManageOpen = false;
  isProgressManageOpen = false;
  userRole: string = '';
  currentUser: any = {};

  constructor(private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.loadCurrentAdmin();
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

  loadCurrentAdmin() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res.user;
        this.userRole = this.currentUser.role;
        console.log(this.currentUser);

      }, error: (error) => {
        console.log(error.message);
      }
    })
  }

  toggleSidebar() {
    this.sidebarToggle = !this.sidebarToggle;
  }


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    // Thêm hoặc xóa lớp 'dark' trên thẻ <html>
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onSidebarMouseEnter() {
    this.isSidebarHovered = true;
  }

  onSidebarMouseLeave() {
    this.isSidebarHovered = false;
  }
}
