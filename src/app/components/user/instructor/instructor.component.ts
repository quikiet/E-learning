import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { Tag } from 'primeng/tag';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InstructorsService } from '../../../services/instructors.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-instructor',
  imports: [ButtonModule, CarouselModule, RouterLink],
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.css'
})
export class IntructorComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel!: Carousel;

  constructor(private instructorService: InstructorsService) { }

  prevSlide(event: MouseEvent) {
    this.carousel.navBackward(event);
  }

  nextSlide(event: MouseEvent) {
    this.carousel.navForward(event);
  }

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".teacher_carousel", {
      opacity: 0,
      y: 100,
      stagger: 0.3,
      duration: 1,
      scrollTrigger: {
        trigger: ".shape_intructor",
        start: "top bottom",
        end: "top center",
      }
    });
    gsap.from(".shape_intructor", {
      duration: 1.5,
      delay: 1,
      opacity: 0,
      x: 100,
      scrollTrigger: {
        trigger: ".teacher_carousel",
        start: "top center",
        scrub: 1,
        end: "top center",
        // end: "+=250",
      }
    });

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
  instructors: any[] = [];

  responsiveOptions: any[] | undefined;

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 4,
        numScroll: 4
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
    this.loadInstructor();
  }

  loadInstructor() {
    this.instructorService.getTop10Instructor().subscribe({
      next: (res) => {
        this.instructors = res.data;

      }, error: (err) => {
        console.log(err.message);
      }
    })
  }

  currentPage: number = 0; // Trang hiện tại của carousel
  numVisible: number = 4; // Số item hiển thị (mặc định là 5)
  numScroll: number = 4; // Số item cuộn mỗi lần
  activeCard: any = null; // Quản lý card đang hover
  cardHoverPosition: any = {};
  onCarouselPageChange(event: any): void {
    this.currentPage = event.page;
    this.numVisible = event.numVisible || 4;
    this.numScroll = event.numScroll || 4;
  }
}
