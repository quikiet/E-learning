import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/User/main-layout/main-layout.component';
import { HomeComponent } from './pages/User/home/home.component';
import { LoginComponent } from './pages/both/login/login.component';
import { CourseDetailComponent } from './pages/User/course-detail/course-detail.component';
import { ProfileComponent } from './pages/both/profile/profile.component';
import { ProfileInfoComponent } from './components/both/profile-info/profile-info.component';

export const routes: Routes = [
    {
        path: '', component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'course-learning', component: CourseDetailComponent },
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
