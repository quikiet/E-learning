import { Component, OnInit } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../services/courses.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-category-carousel',
  imports: [RouterLink, Carousel, ButtonModule, Tag, CommonModule],
  templateUrl: './category-carousel.component.html',
  styleUrl: './category-carousel.component.css'
})
export class CategoryCarouselComponent implements OnInit {
  lists: any[] = [];
  userId: number | null = null;
  responsiveOptions: any[] | undefined;
  recommendations: any = [];
  constructor(private categoryService: CategoryService
    , private courseService: CoursesService,
    private authService: AuthService
  ) { }
  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.userId = res.user.id;
        console.log(this.userId);

        if (this.userId) {
          this.loadRecommendCourse(this.userId);
        }
      }, error: (err) => {
        console.log(err.error);
      }
    });

    this.loadCategory();

    this.responsiveOptions = [
      {
        breakpoint: '1980px',
        numVisible: 5,
        numScroll: 1
      },
      {
        breakpoint: '980px',
        numVisible: 3,
        numScroll: 1
      },

      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
    ]
  }

  loadCategory() {
    this.categoryService.getCategory().subscribe({
      next: (res) => {
        this.lists = res
      }, error: (err) => {
        console.log(err.message);
      }
    })
  }

  loadRecommendCourse(user_id: number) {
    this.courseService.getCoursesRecommendByUser(user_id).subscribe({
      next: (res) => {
        this.recommendations = res.recommendations;
        console.log('hehe' + this.recommendations);
      }, error: (err) => {
        console.log('hehe' + err.error);

        console.error('Error fetching recommendations:', err.error);
      }
    })
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split('');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join('') + '...';
  }
}
