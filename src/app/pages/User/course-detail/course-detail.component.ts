import { Component, OnInit } from '@angular/core';
import { Avatar, AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { Tag, TagModule } from 'primeng/tag';
import { CoursesService } from '../../../services/courses.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { HeaderComponent } from "../../../components/user/header/header.component";
import { LoadingComponent } from '../../../components/both/loading/loading.component';
import { CardSkeletonComponent } from "../../../components/both/card-skeleton/card-skeleton.component";
import { FormBuilder, FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormElementComponent } from "../../../components/both/form-element/form-element.component";
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { CategoryService } from '../../../services/courses-manage/category.service';
import { FloatLabelModule } from 'primeng/floatlabel';
// Định nghĩa interface cho bài học
interface Lesson {
  title: string;
  video_url: string;
  duration: number;
  is_preview: boolean;
  status: string;
}

// Định nghĩa interface cho tab
interface Tab {
  title: string;
  content: { [key: number]: Lesson };
  contentLength: number;
  totalDuration: number;
  value: string;
}


interface optionSelect {
  name: string;
  value: string;
}

@Component({
  selector: 'app-course-detail',
  imports: [
    AccordionModule,
    CommonModule,
    DividerModule,
    AvatarModule,
    TagModule,
    MultiSelectModule,
    TooltipModule,
    HeaderComponent,
    LoadingComponent,
    FormsModule,
    RadioButtonModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormElementComponent,
    SelectModule,
    ReactiveFormsModule,
    CheckboxModule,
    RouterLink,
    FloatLabelModule,
  ],
  providers: [MessageService],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})

export class CourseDetailComponent implements OnInit {
  course: any = null;
  tabs: Tab[] = [];
  lessons: any[] = [];
  reviews: any[] = [];
  previewVideoUrl: string = '';
  isUserEnrolled: boolean = false;
  isAuthor: boolean = false;
  currentVideoUrl: string | null = null;
  currentUserId: number | null = null;
  isLoading: boolean = false;
  couponCode: string = '';
  discountedPrice: number | null = null;
  couponError: string | null = null;
  selectedPaymentMethod: string | null = null;
  paymentMethods = [
    { label: 'VNPay', value: 'vnpay' },
    { label: 'PayPal', value: 'paypal' }
  ];
  studentDialog = false;
  studentForm!: FormGroup;
  LoE: optionSelect[] | undefined;
  learningGoals = [
    { label: 'Career advancement', value: 'Career advancement' },
    { label: 'Skill development', value: 'Skill development' },
    { label: 'Personal growth', value: 'Personal growth' },
    { label: 'Academic improvement', value: 'Academic improvement' },
    { label: 'Certification', value: 'Certification' }
  ];
  categories: any[] = [];
  selectedLoE: optionSelect | undefined;
  recommendCourse: any = [];
  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUserId = res?.user.id;
        this.loadCourse();
      },
      error: (err) => {
        console.error('Error getting current user:', err);
        this.loadCourse(); // Still load course even if user fetch fails
      }
    });

    this.studentForm = this.fb.group({
      LoE_DI: ['', Validators.maxLength(50)],
      learning_goals: [''],
      category_ids: [[]],
    });
    this.LoE = [
      { name: 'Unknown', value: 'Unknown' },
      { name: 'Beginner', value: 'Beginner' },
      { name: 'Intermediate', value: 'Intermediate' },
      { name: 'Advanced', value: 'Advanced' },
    ];
  }

  loadCourse() {
    this.isLoading = true;
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.coursesService.getCourseBySlug(slug).subscribe({
        next: (res) => {
          this.course = res;
          // console.log('course: ' + this.course?.course_name);

          if (this.course && this.course?.course_name) {
            this.loadCourseRecommendByTilte(this.course?.course_name);
          }
          this.lessons = res.lessons || [];
          this.reviews = res.reviews || [];
          this.isUserEnrolled = this.checkUserEnrollment(res.enrollments);
          this.isAuthor = this.checkAuthor(res.instructors);
          // Find the first lesson with is_preview: true
          const previewLesson = this.lessons.find(lesson => lesson.is_preview === true);
          this.previewVideoUrl = previewLesson ? previewLesson.video_url : null;

          // console.log('Course:', this.course);
          // console.log('Preview Video URL:', this.previewVideoUrl);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading course:', err);
          this.course = null;
          this.lessons = [];
          this.reviews = [];
          this.previewVideoUrl = '';
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Unable to load course details.',
            life: 3000
          });
          this.router.navigate(['/']);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid course slug.',
        life: 3000
      });
      this.router.navigate(['/']);
    }
  }


  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  loadCourseRecommendByTilte(course_title: string) {
    this.coursesService.getCoursesByRecommend(course_title).subscribe({
      next: (res) => {
        this.recommendCourse = res.recommendations;
        console.log(this.recommendCourse.length + 'hehe');
      }, error: (err) => {
        console.log(err.message);
      }
    })
  }

  onSubmitForm() {
    if (this.studentForm.invalid) {
      console.log('Form invalid:', this.studentForm.errors);
      this.studentForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
        life: 3000
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.studentForm.value;
    const data = {
      LoE_DI: formValue.LoE_DI,
      learning_goals: formValue.learning_goals, // Already a string
      category_ids: formValue.category_ids
    };
    console.log('Submitting student profile:', data);

    this.authService.instructorRequestToBuyCourse(data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message || 'Student profile updated successfully.',
          life: 3000
        });
        this.isLoading = false;
        this.studentDialog = false;
        this.studentForm.reset();
        this.enrollCourse();
      },
      error: (err) => {
        console.error('Error submitting student profile:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Unable to update student profile.',
          life: 3000
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  checkUserEnrollment(enrollments: any[]): boolean {
    if (!this.currentUserId || !enrollments?.length) return false;

    // Kiểm tra xem user_id của người dùng hiện tại có trong danh sách enrollments không
    return enrollments.some(enrollment => enrollment.user_id === this.currentUserId);
  }

  checkAuthor(instructors: any) {
    if (!this.currentUserId) return false;

    return instructors.user_id === this.currentUserId;
  }

  navigateToCourseManage(course_id: number) {
    this.router.navigate([`/course/${course_id}/user-progress`]);
  }

  navigateToLearnCourse(course_id: number) {
    this.router.navigate([`/my-course/${course_id}`]);
  }

  getTotalDuration(lessons: any[]): number {
    return lessons.reduce((total: number, lesson: any) => total + (lesson.duration || 0), 0);
  }

  playVideo(videoUrl: string) {
    this.currentVideoUrl = videoUrl;
  }

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

  enrollCourse() {
    if (!this.course || !this.selectedPaymentMethod) return;
    const paymentData = {
      amount: this.course.price,
      method: this.selectedPaymentMethod,
      code: this.couponCode || null
    };
    this.coursesService.enrollCourse(this.course.id, paymentData).subscribe({
      next: (res) => {
        // console.log('Enroll course response:', res);
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: res.message,
        //   life: 3000
        // });
        if (res.order) {
          if (this.selectedPaymentMethod === 'vnpay' && res.order.data) {
            window.location.href = res.order.data;
          } else if (this.selectedPaymentMethod === 'paypal' && res.order.approval_url) {
            window.location.href = res.order.approval_url;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
              life: 3000
            });
          }
        } else if (res.message === 'Student profile not found. Please complete your profile.') {
          this.studentDialog = true;
          this.categoryService.getAllCategory().subscribe({
            next: (res) => {
              this.categories = res;
              console.log(this.categories);

            },
            error: (error) => {
              alert('Không thể tải danh mục' + error.message);
            }
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Error',
            detail: res.message,
            life: 3000
          });
        }
      },
      error: (err) => {
        console.error('Error enrolling course:', err);
        this.couponCode = '';
        this.messageService.add({
          severity: 'error',
          summary: err.error.message || 'Error',
          detail: err.error.error,
          life: 3000
        });
      }
    });
  }

  enrollFreeCourse() {
    if (!this.course) return;

    this.coursesService.enrollFreeCourse(this.course.id).subscribe({
      next: (res) => {
        if (res.order?.data) {
          // Điều hướng người dùng đến URL thanh toán
          window.location.href = res.order.data;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể khởi tạo thanh toán',
            life: 3000,
          });
        }
      },
      error: (err) => {
        console.error('Error enrolling course:', err);
        const errorMessage = err.error?.message || 'Không thể mua khóa học. Vui lòng thử lại.';
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: errorMessage,
          life: 3000,
        });
      }
    });
  }

  cutText(text: string, wordLimit: number = 50): string {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}