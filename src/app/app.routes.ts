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
import { CategoryManageComponent } from './pages/category-manage/category-manage.component';
import { CourseManageComponent } from './pages/admin/course-manage/course-manage.component';

export const routes: Routes = [
    {
        path: '', component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'product', component: CourseCardComponent },
            { path: 'course-learning', component: CourseDetailComponent },
            { path: 'cart', component: ShoppingCartComponent },
        ]
    },
    {
        path: 'admin', component: DashboardComponent,
        children: [
            { path: '', component: CourseManageComponent },
        ]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        children: [
            { path: '', component: ProfileInfoComponent }
        ]
    },
];
