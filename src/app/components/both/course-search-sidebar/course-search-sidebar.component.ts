import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Button, ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { AccordionModule } from 'primeng/accordion';
import { TextareaModule } from 'primeng/textarea';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormElementComponent } from '../form-element/form-element.component';
import { SliderModule } from 'primeng/slider';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Checkbox } from 'primeng/checkbox';
import { RadioButton } from 'primeng/radiobutton';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-course-search-sidebar',
  imports: [Divider, AccordionModule, RadioButton, Checkbox, SliderModule, FormsModule, ConfirmPopupModule, ReactiveFormsModule, ToastModule, TooltipModule, Button, PopoverModule, AccordionModule, TextareaModule, AvatarModule, DrawerModule, InputGroupModule, InputGroupAddonModule, ConfirmDialogModule, ButtonModule, TableModule, DialogModule, SelectModule, ToastModule, ToolbarModule, InputTextModule, TextareaModule, InputTextModule, FormsModule, IconFieldModule, InputIconModule, FormElementComponent, ReactiveFormsModule],
  templateUrl: './course-search-sidebar.component.html',
  styleUrl: './course-search-sidebar.component.css'
})
export class CourseSearchSidebarComponent implements OnInit {
  @Output() search = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>(); // Thêm event reset
  @Input() selectedCategories: number[] | null = null;
  categories: any[] = [];
  searchForm: FormGroup;
  difficultyOptions = [
    { label: 'All', value: null },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' }
  ];
  categoryOptions: any[] = [];
  sortOptions = [
    { label: 'Top Rated', value: 'course_rating-desc' },
    { label: 'Price low to high', value: 'price-asc' },
    { label: 'Price higt to low', value: 'price-desc' },
    { label: 'Most popular', value: 'enrollments-desc' }
  ];

  private isInitializing = false; // Flag để tránh gọi API khi đang khởi tạo

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      keyword: [''],
      categories: [[]],
      difficulty: [null],
      min_rating: [0],
      min_price: [0],
      max_price: [null],
      sort: ['course_rating-desc']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.initializeFromUrl();

    // Lắng nghe thay đổi của form và debounce
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(() => {
        // Chỉ gọi search sau khi đã khởi tạo xong
        if (!this.isInitializing) {
          this.onSearch();
        }
      });
  }

  private initializeFromUrl() {
    this.isInitializing = true;

    this.route.queryParams.subscribe(params => {
      // Reconstruct sort value
      let sortValue = 'course_rating-desc';
      if (params['sort_by'] && params['sort_order']) {
        sortValue = `${params['sort_by']}-${params['sort_order']}`;
      }
      const categories = params['categories']
        ? params['categories'].split(',').map(Number).filter((id: number) => !isNaN(id))
        : [];
      this.searchForm.patchValue({
        keyword: params['keyword'] || '',
        categories: categories,
        difficulty: params['difficulty'] || null,
        min_rating: params['min_rating'] || 0,
        min_price: params['min_price'] || 0,
        max_price: params['max_price'] || null,
        sort: sortValue
      }, { emitEvent: false }); // Không emit event khi patch value

      // Cho phép emit event sau khi khởi tạo xong
      setTimeout(() => {
        this.isInitializing = false;
      }, 100);
    });
  }

  loadCategories() {
    this.categoryService.getAllCategory().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (error) => {
        alert('Không thể tải danh mục' + error.message);
      }
    });
  }

  onSearch() {
    const formValue = this.searchForm.value;
    const [sort_by, sort_order] = formValue.sort.split('-');

    const params = {
      keyword: formValue.keyword || null,
      categories: formValue.categories.length > 0 ? formValue.categories : null,
      difficulty: formValue.difficulty || null,
      min_rating: formValue.min_rating || null,
      min_price: formValue.min_price || null,
      max_price: formValue.max_price || null,
      sort_by: sort_by,
      sort_order: sort_order,
      per_page: 10
    };

    this.search.emit(params);
  }

  resetFilters() {
    this.isInitializing = true;

    this.searchForm.reset({
      keyword: '',
      categories: '',
      difficulty: null,
      min_rating: 0,
      min_price: 0,
      max_price: null,
      sort: 'course_rating-desc'
    }, { emitEvent: false });

    // Emit event reset để parent component xử lý URL
    this.reset.emit();

    setTimeout(() => {
      this.isInitializing = false;
      this.onSearch();
    }, 100);
  }
}