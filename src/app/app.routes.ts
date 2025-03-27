import { Routes } from '@angular/router';
import { LoginComponent } from './components/logs/login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    // {path:'login',component:LoginComponent, canActivate:[authGuard]},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'',redirectTo:'/Login', pathMatch: 'full'},
    {path:'spendRequest', loadChildren: () => import('./apps/create-spend-request/create-spend-request.module').then(m=>m.CreateSpendRequestModule)},
    {path:'**',redirectTo:'/Login', pathMatch: 'full'},
];
