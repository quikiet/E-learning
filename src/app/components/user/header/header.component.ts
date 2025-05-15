import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { Divider } from 'primeng/divider';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [BadgeModule, RouterLink, Divider, InputIcon, IconField, InputTextModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navBarToggle: boolean = false;
  dropdownOpen: boolean = false;
  toggleNavbar() {
    this.navBarToggle = !this.navBarToggle;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
