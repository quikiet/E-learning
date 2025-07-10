import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AuthService } from './services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'Elearning-Website';
  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".flow-up", {
      duration: 1.5,
      delay: 1,
      opacity: 0,
      x: 100,
      scrollTrigger: {
        start: "top bottom",
        scrub: 1,
        end: "+=50",
      }
    });
  }
  constructor(private authService: AuthService,
    private router: Router
  ) { }
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token_expiry');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        // vẫn xoá localStorage nếu cần
        localStorage.removeItem('token_expiry');
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    this.checkTokenExpiry();
  }

  checkTokenExpiry() {
    const expiry = localStorage.getItem('token_expiry');
    if (expiry) {
      const now = new Date().getTime();
      const remaining = parseInt(expiry) - now;

      if (remaining <= 0) {
        this.logout(); // tự động logout
      } else {
        setTimeout(() => {
          this.logout(); // logout khi hết hạn
        }, remaining);
      }
    }
  }


}
