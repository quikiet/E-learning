import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag'; import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Carousel, CarouselPageEvent } from 'primeng/carousel';
import { TabsModule } from 'primeng/tabs';
import { CoursesService } from '../../../../services/courses.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink, TabsModule, Carousel, DividerModule, ButtonModule, CardModule, Tag, CommonModule, FormsModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent implements OnInit {
  @ViewChild('carousel') carousel!: Carousel;
  @ViewChild('cardHover') cardHover!: ElementRef;

  courses: any[] = [];
  currentPage: number = 0; // Trang hiện tại của carousel
  numVisible: number = 5; // Số item hiển thị (mặc định là 5)
  numScroll: number = 5; // Số item cuộn mỗi lần
  activeCard: any = null; // Quản lý card đang hover
  cardDetail: any = null;
  currentIndex = 0;
  cardHoverPosition: any = {};
  responsiveOptions: any[] = [
    { breakpoint: '1400px', numVisible: 5, numScroll: 5 },
    { breakpoint: '1199px', numVisible: 5, numScroll: 5 },
    { breakpoint: '767px', numVisible: 2, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 }
  ];

  prevSlide(event: MouseEvent) {
    this.carousel.navBackward(event);
  }

  nextSlide(event: MouseEvent) {
    this.carousel.navForward(event);
  }

  constructor(private courseService: CoursesService) { }


  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses(1, 10).subscribe({
      next: (res) => {
        this.courses = res.data;
        console.log('Full API Response:', this.courses);

        console.log('Courses loaded:', this.courses);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  getStarArray(rating: number): string[] {
    const stars = Array(5).fill('☆');
    for (let i = 0; i < rating; i++) {
      stars[i] = '★';
    }
    return stars;
  }

  onCarouselPageChange(event: any): void {
    this.currentPage = event.page;
    this.numVisible = event.numVisible || 5;
    this.numScroll = event.numScroll || 5;
  }

  getCurrentPosition(list: any): number {
    const totalItems = this.courses.length;
    const startIndex = this.currentPage * this.numScroll;
    const itemsInCurrentPage = Math.min(this.numVisible, totalItems - startIndex);
    const currentIndex = this.courses.indexOf(list);

    if (currentIndex >= startIndex && currentIndex < startIndex + itemsInCurrentPage) {
      return currentIndex - startIndex;
    }
    return -1;
  }

  getItemsInCurrentPage(): number {
    const totalItems = this.courses.length;
    const startIndex = this.currentPage * this.numScroll;
    return Math.min(this.numVisible, totalItems - startIndex);
  }

  getDifficultySeverity(level: string): string {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'info';
      case 'advanced': return 'warning';
      default: return 'secondary';
    }
  }

  showCardHover(event: MouseEvent, list: any): void {
    console.log(1);

    this.activeCard = list;
    this.cardDetail = list;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const position = this.getCurrentPosition(list);
    const itemsInPage = this.getItemsInCurrentPage();

    // Xác định vị trí của card-hover
    const isLastTwo = position >= itemsInPage - 2 && position !== -1; // Hai phần tử cuối

    this.cardHoverPosition = {
      top: `${rect.top + window.scrollY + rect.height}px`,
      left: isLastTwo
        ? `${rect.left + window.scrollX - 384}px` // 384px là chiều rộng w-96 của card-hover
        : `${rect.right + window.scrollX - 16}px`,
      transform: 'translateY(-80%)',
    };
  }
  hideCardHover(): void {
    this.activeCard = null;
  }

  keepCardHover() {
    console.log(2);
    this.activeCard = this.cardDetail;
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}

