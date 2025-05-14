import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag'; import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Carousel, CarouselPageEvent } from 'primeng/carousel';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-course-card',
  imports: [TabsModule, Carousel, DividerModule, ButtonModule, CardModule, Tag, CommonModule, FormsModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent implements OnInit {
  @ViewChild('carousel') carousel!: Carousel;
  @ViewChild('cardHover') cardHover!: ElementRef;
  private hoverTimeout: any;

  prevSlide(event: MouseEvent) {
    this.carousel.navBackward(event);
  }

  nextSlide(event: MouseEvent) {
    this.carousel.navForward(event);
  }

  lists: any[] = [
    { 'value': 1, },
    { 'value': 2, },
    { 'value': 3, },
    { 'value': 4, },
    { 'value': 5, },
    { 'value': 6, },
    { 'value': 7, },
    { 'value': 8, },
  ];
  currentIndex = 0;


  responsiveOptions: any[] | undefined;

  constructor() { }
  currentPage: number = 0; // Trang hiện tại của carousel
  numVisible: number = 5; // Số item hiển thị (mặc định là 5)
  numScroll: number = 5; // Số item cuộn mỗi lần
  activeCard: any = null; // Quản lý card đang hover
  cardDetail: any = null;
  cardHoverPosition: any = {};

  ngOnInit() {
    console.log(this.lists);

    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 5,
        numScroll: 5
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
    ]
  }

  onCarouselPageChange(event: any): void {
    this.currentPage = event.page;
    this.numVisible = event.numVisible || 5;
    this.numScroll = event.numScroll || 5;
  }

  getCurrentPosition(list: any): number {
    const totalItems = this.lists.length;
    const startIndex = this.currentPage * this.numScroll;
    const itemsInCurrentPage = Math.min(this.numVisible, totalItems - startIndex);
    const currentIndex = this.lists.indexOf(list);

    if (currentIndex >= startIndex && currentIndex < startIndex + itemsInCurrentPage) {
      return currentIndex - startIndex;
    }
    return -1;
  }

  getItemsInCurrentPage(): number {
    const totalItems = this.lists.length;
    const startIndex = this.currentPage * this.numScroll;
    return Math.min(this.numVisible, totalItems - startIndex);
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

  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   const cardElement = document.querySelector('.group:hover');
  //   const hoverElement = document.querySelector('.hover-popup:hover'); // class tùy bạn

  //   if (!cardElement && !hoverElement) {
  //     this.hideCardHover();
  //   }
  // }
}

