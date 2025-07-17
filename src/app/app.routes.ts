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
import { ReportManageComponent } from './pages/admin/report-manage/report-manage.component';
import { DetailInstructorComponent } from './pages/User/detail-instructor/detail-instructor.component';
import { SocialCallbackComponent } from './components/social-callback/social-callback.component';
import { SelectRoleComponent } from './components/select-role/select-role.component';
import { InstructorRequestComponent } from './pages/User/instructor-request/instructor-request.component';
import { ResetPasswordComponent } from './pages/User/reset-password/reset-password.component';
import { CourseCommentStatsComponent } from './pages/User/course-comment-stats/course-comment-stats.component';
import { InstructorRevenueComponent } from './pages/User/instructor-revenue/instructor-revenue.component';
import { adminGuard } from './guard/admin.guard';
import { PolicyComponent } from './pages/User/policy/policy.component';
import { instructorGuard } from './guard/instructor.guard';
import { UnauthorizationComponent } from './pages/User/unauthorization/unauthorization.component';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent,
        canActivate: [isLoggedInGuard]
    },
    {
        path: 'reset-password', component: ResetPasswordComponent,
        canActivate: [isLoggedInGuard]
    },
    {
        path: 'social-callback', component: SocialCallbackComponent,
        canActivate: [isLoggedInGuard]
    }, // Route cho callback Google OAuth
    // { path: 'select-role', component: SelectRoleComponent },
    {
        path: 'auth/google/callback', component: AuthCallbackComponent,
        canActivate: [isLoggedInGuard]
    },
    {
        path: 'unauthorization', component: UnauthorizationComponent,
    },
    {
        path: '', component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'course', component: CourseSearchComponent },
            { path: 'policy', component: PolicyComponent },
            { path: 'user/:id', component: DetailInstructorComponent },
            { path: 'quiz/:quizId/attempt', component: StudentQuizAttemptComponent, },
            {
                path: 'my-course', component: StudentPurchasedCoursesComponentComponent,
            },
            {
                path: 'my-course/:id', component: StudentCourseLessonsComponentComponent,
            },
        ]
    },
    { path: 'course-detail/:slug', component: CourseDetailComponent },
    {
        path: 'quiz/:quiz_id',
        component: QuizTakingComponent,
    },

    {
        path: 'admin', component: AdminComponent, canActivate: [adminGuard],
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
            { path: 'report-manage', component: ReportManageComponent },
            { path: 'payment-manage', component: PaymentManageComponent },
            { path: 'quan-ly-tien-do', component: ProgressManageComponent },
            { path: 'quan-ly-chung-chi', component: CertificateManageComponent },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
    },
    {
        path: '',
        component: ProfileComponent,
        children: [
            { path: 'profile', component: ProfileInfoComponent },
            { path: 'payment-history', component: StudentPaymentHistoryComponent },
            { path: 'create-course', component: CreateCourseComponent },
            { path: 'instructor-request', component: InstructorRequestComponent },
            { path: 'instructor-course', component: InstructorCoursesComponent, canActivate: [instructorGuard] },
            { path: 'coupon-manage/:courseID', component: CouponManageComponent, canActivate: [instructorGuard] },
            { path: 'instructor-course/:id', component: CourseCommentStatsComponent, canActivate: [instructorGuard] },
            { path: 'my-revenue-instructor', component: InstructorRevenueComponent, canActivate: [instructorGuard] },
            { path: 'quiz-management/:lessonID', component: InstructorQuizManagementComponent, canActivate: [instructorGuard] },
            { path: 'add-lesson/:courseId', component: AddLessonsComponent, canActivate: [instructorGuard] },
            { path: 'reports', component: InstructorReportsComponent, canActivate: [instructorGuard] },
            { path: 'course/:course_id/user-progress', component: CourseProgressComponent, canActivate: [instructorGuard] },
            { path: '**', redirectTo: 'profile', pathMatch: 'full' },
        ]
    },


    { path: '**', redirectTo: '', pathMatch: 'full' },

];
