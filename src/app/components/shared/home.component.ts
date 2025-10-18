import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1 class="hero-title">Welcome to DeskOps</h1>
        <p class="hero-subtitle">Smart desk booking for modern offices</p>

        <div class="hero-features">
          <p-card styleClass="feature-card">
            <ng-template #header>
              <i class="pi pi-map-marker feature-icon"></i>
            </ng-template>
            <ng-template #title>Easy Booking</ng-template>
            <ng-template #content>
              <p>Reserve your desk in seconds</p>
            </ng-template>
          </p-card>

          <p-card styleClass="feature-card">
            <ng-template #header>
              <i class="pi pi-cloud feature-icon"></i>
            </ng-template>
            <ng-template #title>Weather Forecast</ng-template>
            <ng-template #content>
              <p>Plan your commute with weather insights</p>
            </ng-template>
          </p-card>

          <p-card styleClass="feature-card">
            <ng-template #header>
              <i class="pi pi-car feature-icon"></i>
            </ng-template>
            <ng-template #title>Traffic Info</ng-template>
            <ng-template #content>
              <p>Get real-time traffic updates</p>
            </ng-template>
          </p-card>
        </div>

        <div class="hero-cta" *ngIf="!(auth.isAuthenticated$ | async)">
          <p-button
            (onClick)="login()"
            label="Get Started"
            icon="pi pi-sign-in"
            size="large"
            styleClass="hero-button"
          ></p-button>
        </div>

        <div class="hero-cta" *ngIf="auth.isAuthenticated$ | async">
          <p-button
            routerLink="/dashboard"
            label="Go to Dashboard"
            icon="pi pi-th-large"
            size="large"
            styleClass="hero-button"
          ></p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .hero-section {
      text-align: center;
      color: white;
      padding: 4rem 2rem;
      max-width: 1000px;
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

      @media (max-width: 768px) {
        font-size: 2.5rem;
      }
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 3rem;
      opacity: 0.95;

      @media (max-width: 768px) {
        font-size: 1.2rem;
      }
    }

    .hero-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    :host ::ng-deep .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.3s;
      color: white;
    }

    :host ::ng-deep .feature-card:hover {
      transform: translateY(-8px);
      background: rgba(255, 255, 255, 0.15);
    }

    :host ::ng-deep .feature-card .p-card-header {
      text-align: center;
      padding: 2rem 0 1rem;
    }

    :host ::ng-deep .feature-card .p-card-title {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: white;
    }

    :host ::ng-deep .feature-card .p-card-content {
      color: rgba(255, 255, 255, 0.9);
      text-align: center;
    }

    .feature-icon {
      font-size: 3rem;
      color: white;
    }

    .hero-cta {
      margin-top: 2rem;
    }

    :host ::ng-deep .hero-button {
      background: white;
      color: #667eea;
      border: none;
      padding: 1.25rem 3.5rem;
      font-size: 1.2rem;
      font-weight: 700;
      border-radius: 50px;
    }

    :host ::ng-deep .hero-button:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  `]
})
export class HomeComponent {
  auth = inject(AuthService);

  login() {
    this.auth.loginWithRedirect();
  }
}