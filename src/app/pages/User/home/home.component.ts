import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { CategoryCarouselComponent } from "../../../components/user/category-carousel/category-carousel.component";
import { CourseCardComponent } from "../../../components/user/home/course-card/course-card.component";
import { IntructorComponent } from "../../../components/user/instructor/instructor.component";
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [CommonModule, CategoryCarouselComponent, CourseCardComponent, IntructorComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnInit {

  dotAnimate = 'left';
  imageAnimate = 'up';
  showScrollTop: boolean = false;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Hiển thị nút khi cuộn xuống hơn 1000px
    this.showScrollTop = window.scrollY > 1000;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {

  }

  startDotAnimate() {
    gsap.to(".dot", {
      y: 10,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }

  startImageAnimate() {
    setInterval(() => {
      this.imageAnimate = this.imageAnimate === 'up' ? 'down' : 'up';
    }, 2000);
  }

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
    gsap.timeline({
      onComplete: () => {
        this.startDotAnimate();
        this.startImageAnimate();
      }
    });
    gsap.from(".left-section", {
      duration: 1,
      opacity: 0,
      x: -50,
      stagger: 0.3,
    });
    gsap.from(".thumb-girl", {
      y: "10vh",
      duration: 1,
      opacity: 0,
    });
    gsap.from(".thumb-boy", {
      y: "10vh",
      duration: 1,
      opacity: 0,
      delay: 0.3,
    });
    gsap.fromTo(".dot", {
      opacity: 0,
      scale: 0,
    }, {
      opacity: 1,
      scale: 1,
      delay: 0.5,
      duration: 1.5
    });
  }
}
