import { Routes } from '@angular/router';
import { HomeComponent } from './components/shared/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'reservations', component: ReservationsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '' }
];
