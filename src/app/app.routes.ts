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
import { AddLessonsComponent } from './pages/User/add-lessons/add-lessons.component';
import { InstructorCoursesComponent } from './pages/User/instructor-courses/instructor-courses.component';
import { CoursePendingLessonsComponent } from './pages/admin/course-pending-lessons/course-pending-lessons.component';
import { StudentPaymentHistoryComponent } from './pages/User/student-payment-history/student-payment-history.component';
import { StudentPurchasedCoursesComponentComponent } from './pages/User/student-purchased-courses-component/student-purchased-courses-component.component';
import { StudentCourseLessonsComponentComponent } from './pages/User/student-course-lessons-component/student-course-lessons-component.component';
import { InstructorQuizManagementComponent } from './pages/User/instructor-quiz-management/instructor-quiz-management.component';
import { StudentQuizAttemptComponent } from './pages/both/student-quiz-attempt/student-quiz-attempt.component';
import { QuizTakingComponent } from './pages/User/quiz-taking/quiz-taking.component';
import { AdminCourseManagementComponent } from './pages/admin/admin-course-management/admin-course-management.component';
import { CourseProgressComponent } from './pages/User/course-progress/course-progress.component';
import { AuthCallbackComponent } from './pages/User/auth-callback/auth-callback.component';
import { InstructorReportsComponent } from './pages/User/instructor-reports/instructor-reports.component';

export const routes: Routes = [
    {
        path: '', component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            {
                path: 'quiz/:quizId/attempt',
                component: StudentQuizAttemptComponent
            },
            {
                path: 'quiz/:quiz_id',
                component: QuizTakingComponent
            },
            { path: 'course', component: CourseSearchComponent },
            { path: 'my-course', component: StudentPurchasedCoursesComponentComponent },
            { path: 'my-course/:id', component: StudentCourseLessonsComponentComponent },
        ]
    },
    { path: 'course-detail/:slug', component: CourseDetailComponent },

    { path: 'login', component: LoginComponent },
    { path: 'auth/google/callback', component: AuthCallbackComponent },
    {
        path: 'admin', component: AdminComponent,
        children: [
            { path: 'profile', component: ProfileInfoComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'user-manage', component: UserManageComponent },
            { path: 'instructor-manage', component: InstructorManageComponent },
            { path: 'quan-ly-don-duyet', component: RequestReviewComponent },
            { path: 'deleted-user', component: UserDeletedComponent },
            { path: 'user-manage/:id', component: UserDetailComponent },
            { path: 'course-manage', component: AdminCourseManagementComponent },
            { path: 'course-manage/:courseId', component: CoursePendingLessonsComponent },
            { path: 'pending-course', component: PendingCoursesComponent },
            { path: 'category-manage', component: CategoryManageComponent },
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
        path: '',
        component: ProfileComponent,
        children: [
            { path: 'profile', component: ProfileInfoComponent },
            { path: 'instructor-course', component: InstructorCoursesComponent },
            { path: 'create-course', component: CreateCourseComponent },
            { path: 'quiz-management/:lessonID', component: InstructorQuizManagementComponent },
            { path: 'payment-history', component: StudentPaymentHistoryComponent },
            { path: 'add-lesson/:courseId', component: AddLessonsComponent },
            { path: 'reports', component: InstructorReportsComponent },
            { path: 'course/:course_id/user-progress', component: CourseProgressComponent },
            { path: '**', redirectTo: 'ho-so', pathMatch: 'full' },
        ]
    },


    { path: '**', redirectTo: '', pathMatch: 'full' },

];
