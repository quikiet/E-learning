import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  sidebarToggle: boolean = false;
  dropdownOpen: boolean = false;
  isDarkMode: boolean = false; // Mặc định là light mode
  isSidebarHovered: boolean = false;
  isUserManageOpen = false;
  isCourseManageOpen = false;
  isQuizManageOpen = false;

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
