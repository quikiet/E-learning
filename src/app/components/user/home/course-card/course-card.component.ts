import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag'; import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Carousel, CarouselPageEvent } from 'primeng/carousel';
import { TabsModule } from 'primeng/tabs';
import { CoursesService } from '../../../../services/courses.service';
import { RouterLink } from '@angular/router';
import { CardSkeletonComponent } from "../../../both/card-skeleton/card-skeleton.component";
import { AnimateOnScroll } from 'primeng/animateonscroll';
@Component({
  selector: 'app-course-card',
  imports: [AnimateOnScroll, RouterLink, TabsModule, Carousel, DividerModule, ButtonModule, CardModule, Tag, CommonModule, FormsModule, CardSkeletonComponent],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent implements OnInit {
  @ViewChild('carousel') carousel!: Carousel;
  @ViewChild('cardHover') cardHover!: ElementRef;

  @Input() apiEndpoint: string = '/courses'; // Default endpoint
  @Input() title: string = 'The field to study next'; // Tiêu đề mặc định
  @Input() subtitle: string = 'Recommended for you'; // Phụ đề mặc định


  courses: any[] = [];
  currentPage: number = 0; // Trang hiện tại của carousel
  numVisible: number = 5; // Số item hiển thị (mặc định là 5)
  numScroll: number = 1; // Số item cuộn mỗi lần
  activeCard: any = null; // Quản lý card đang hover
  cardDetail: any = null;
  currentIndex = 0;
  isLoading = false;
  cardHoverPosition: any = {};
  responsiveOptions: any[] = [
    { breakpoint: '1980px', numVisible: 5, numScroll: 1 },
    // { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '767px', numVisible: 2, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 }
  ];
  category: string = '';


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
    this.isLoading = true;
    this.courseService.getCoursesByEndpoint(this.apiEndpoint, 1, 10).subscribe({
      next: (res) => {
        this.courses = res.data;
        if (res.category) {
          this.category = res.category.name;
        }
        this.isLoading = false;
        console.log(`Courses loaded from ${this.apiEndpoint}:`, this.courses.length);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Error loading courses from ${this.apiEndpoint}:`, err);
      }
    });
  }

  // getStarArray(rating: number): string[] {
  //   const stars = Array(5).fill('☆');
  //   for (let i = 0; i < rating; i++) {
  //     stars[i] = '★';
  //   }
  //   return stars;
  // }

  getStarArray(rating: number): string[] {
    const floor = Math.floor(rating); // Phần nguyên (ví dụ: 3 cho 3.7)
    const decimal = rating - floor; // Phần thập phân (0.7)
    const stars = Array(5).fill('☆');
    for (let i = 0; i < floor; i++) {
      stars[i] = '★';
    }
    if (decimal >= 0.5 && floor < 5) {
      stars[floor] = '★';
    }
    return stars;
  }

  onCarouselPageChange(event: any): void {
    this.currentPage = event.page;
    this.numVisible = event.numVisible || 5;
    this.numScroll = event.numScroll || 1;
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

  showCardHover(event: MouseEvent, list: any): void {
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
        ? `${rect.left - 384}px` // 384px là chiều rộng w-96 của card-hover
        // ? `${rect.left + window.scrollX - 384}px` // 384px là chiều rộng w-96 của card-hover
        : `${rect.right - 16}px`,
      transform: 'translateY(-100%)',
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

