import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar'; import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  imports: [RouterOutlet, RippleModule, AvatarModule, ButtonModule, InputTextModule, FormsModule, DividerModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  constructor(private authService: AuthService) { }
  ngOnInit() {

    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.user = res.user;
      }, error: (err) => {
        console.log(err.message);
      }
    })

  }
}
