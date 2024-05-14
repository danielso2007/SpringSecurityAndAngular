import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then(mod => mod.LoginComponent) },
    { path: '**', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) }
];
