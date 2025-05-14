import { Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/User/main-layout/main-layout.component';
import { HomeComponent } from './pages/User/home/home.component';
import { LoginComponent } from './pages/both/login/login.component';

export const routes: Routes = [
    {
        path: '', component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
        ]
    },
];
