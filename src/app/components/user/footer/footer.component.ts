import { AfterViewInit, Component, OnDestroy, OnInit, model } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { CommonModule } from '@angular/common';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-footer',
  imports: [GalleriaModule, CommonModule, ButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnDestroy, AfterViewInit {
  displayCustom: boolean | undefined;

  activeIndex: number = 0;

  images = model([]);

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  private routerSubscription: Subscription;

  constructor(private router: Router) {
    // Lắng nghe sự kiện chuyển route
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Làm mới ScrollTrigger khi route thay đổi
        setTimeout(() => {
          ScrollTrigger.refresh();
          console.log('ScrollTrigger refreshed for route:', event.url);
        }, 0); // Chạy trong next tick để đảm bảo DOM đã cập nhật
      }
    });
  }
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".footer-head", {
      duration: .5,
      opacity: 0,
      x: -50,
      stagger: 0.3,
      scrollTrigger: {
        trigger: ".footer-section",
        scroller: "body",
        start: "top 90%", // Bắt đầu khi đỉnh footer-head cách đỉnh viewport 70%
        toggleActions: "play none none none", // Chỉ chạy khi vào viewport
      },
    });

    gsap.from(".footer-item", {
      duration: .5,
      opacity: 0,
      y: 50,
      stagger: 0.2,
      delay: 0.1,
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top 90%",
        end: "bottom bottom", // Kéo dài vùng kích hoạt
        // end: "bottom 20%", // Kéo dài vùng kích hoạt
        toggleActions: "play none none none",
      },
    });

    gsap.from(".footer-copyright", {
      duration: 0.5,
      opacity: 0,
      scale: 0,
      delay: 1,
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top 90%",
        end: "bottom bottom", // Kéo dài vùng kích hoạt
        toggleActions: "play none none none",
      },
    });
  }

  ngOnDestroy(): void {
    // Hủy subscription để tránh rò rỉ bộ nhớ
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    // Dọn dẹp tất cả ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
}