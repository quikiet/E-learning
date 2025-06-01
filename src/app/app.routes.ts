import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/User/main-layout/main-layout.component';
import { HomeComponent } from './pages/User/home/home.component';
import { LoginComponent } from './pages/both/login/login.component';
import { CourseDetailComponent } from './pages/User/course-detail/course-detail.component';
import { ProfileComponent } from './pages/both/profile/profile.component';
import { ProfileInfoComponent } from './components/both/profile-info/profile-info.component';
import { ShoppingCartComponent } from './pages/User/shoping-cart/shoping-cart.component';
import { CourseCardComponent } from './components/user/home/course-card/course-card.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { CourseManageComponent } from './pages/admin/course-manage/course-manage.component';
import { isLoggedInGuard } from './guard/is-logged-in.guard';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { UserManageComponent } from './pages/admin/user-manage/user-manage.component';
import { LessonManageComponent } from './pages/admin/lesson-manage/lesson-manage.component';
import { QuizManageComponent } from './pages/admin/quiz-manage/quiz-manage.component';
import { ReviewManageComponent } from './pages/admin/review-manage/review-manage.component';
import { PaymentManageComponent } from './pages/admin/payment-manage/payment-manage.component';
import { ProgressManageComponent } from './pages/admin/progress-manage/progress-manage.component';
import { CertificateManageComponent } from './pages/admin/certificate-manage/certificate-manage.component';
import { CouponManageComponent } from './pages/admin/coupon-manage/coupon-manage.component';
import { CategoryManageComponent } from './pages/admin/category-manage/category-manage.component';
import { UserDetailComponent } from './pages/admin/user-manage/user-detail/user-detail.component';
import { UserDeletedComponent } from './pages/admin/user-manage/user-deleted/user-deleted.component';
import { CourseSearchComponent } from './pages/User/course-search/course-search.component';
import { InstructorRequestComponent } from './pages/User/instructor-request/instructor-request.component';
import { RequestReviewComponent } from './pages/admin/user-manage/request-review/request-review.component';
import { InstructorManageComponent } from './pages/admin/user-manage/instructor-manage/instructor-manage.component';
import { CreateCourseComponent } from './pages/User/create-course/create-course.component';
import { PendingCoursesComponent } from './pages/admin/pending-courses/pending-courses.component';

export const routes: Routes = [
    {
        path: '', component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'product', component: CourseCardComponent },
            { path: 'chi-tiet-khoa-hoc/:slug', component: CourseDetailComponent },
            { path: 'cart', component: ShoppingCartComponent },
            { path: 'khoa-hoc', component: CourseSearchComponent },
            { path: 'tao-khoa-hoc', component: CreateCourseComponent },
            { path: 'yeu-cau', component: InstructorRequestComponent },
        ]
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'admin', component: AdminComponent,
        children: [
            { path: 'ho-so', component: ProfileInfoComponent },
            { path: 'thong-ke', component: DashboardComponent },
            { path: 'quan-ly-nguoi-dung', component: UserManageComponent },
            { path: 'quan-ly-giang-vien', component: InstructorManageComponent },
            { path: 'quan-ly-don-duyet', component: RequestReviewComponent },
            { path: 'nguoi-dung-da-xoa', component: UserDeletedComponent },
            { path: 'quan-ly-nguoi-dung/:id', component: UserDetailComponent },
            // { path: 'quan-ly-khoa-hoc', component: CourseManageComponent },
            { path: 'quan-ly-khoa-hoc', component: PendingCoursesComponent },
            { path: 'danh-sach-khoa-hoc-cho', component: PendingCoursesComponent },
            { path: 'quan-ly-danh-muc', component: CategoryManageComponent },
            { path: 'quan-ly-bai-hoc', component: LessonManageComponent },
            { path: 'quan-ly-quiz', component: QuizManageComponent },
            { path: 'quan-ly-danh-gia', component: ReviewManageComponent },
            { path: 'quan-ly-thanh-toan', component: PaymentManageComponent },
            { path: 'quan-ly-ma-giam-gia', component: CouponManageComponent },
            { path: 'quan-ly-tien-do', component: ProgressManageComponent },
            { path: 'quan-ly-chung-chi', component: CertificateManageComponent },
            { path: '**', redirectTo: 'thong-ke', pathMatch: 'full' },
        ]
    },
    {
        path: 'ho-so',
        component: ProfileComponent,
        children: [
            { path: '', component: ProfileInfoComponent }
        ]
    },


    { path: '**', redirectTo: '', pathMatch: 'full' },

];
