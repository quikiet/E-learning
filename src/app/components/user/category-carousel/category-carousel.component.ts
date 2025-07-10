import { Component, OnInit } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-category-carousel',
  imports: [RouterLink, Carousel, ButtonModule, Tag],
  templateUrl: './category-carousel.component.html',
  styleUrl: './category-carousel.component.css'
})
export class CategoryCarouselComponent implements OnInit {
  lists: any[] = [];
  responsiveOptions: any[] | undefined;
  constructor(private categoryService: CategoryService) { }
  ngOnInit() {
    this.loadCategory();

    this.responsiveOptions = [
      {
        breakpoint: '1980px',
        numVisible: 5,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 5,
        numScroll: 1
      },
      {
        breakpoint: '767px',
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

}
