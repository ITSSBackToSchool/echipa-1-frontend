import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { Reservation, ReservationStatus } from '../../models/reservation.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    TagModule,
    DividerModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="reservations-container">
      <div class="header">
        <h1><i class="pi pi-calendar"></i> My Reservations</h1>
        <p-button
          routerLink="/dashboard"
          label="New Reservation"
          icon="pi pi-plus"
          severity="primary"
        ></p-button>
      </div>

      <div class="loading" *ngIf="loading()">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>Loading...</p>
      </div>

      <div class="error" *ngIf="error()">
        <i class="pi pi-exclamation-triangle"></i> {{ error() }}
      </div>

      <div class="reservations-list" *ngIf="!loading() && reservations().length > 0">
        <p-card
          *ngFor="let reservation of reservations()"
          styleClass="reservation-card"
          [class.cancelled]="reservation.status === 'CANCELLED'"
          [class.completed]="reservation.status === 'COMPLETED'"
        >
          <ng-template #header>
            <div class="reservation-header">
              <div class="reservation-info">
                <h3><i class="pi pi-building"></i> {{ reservation.seat.room.name }}</h3>
                <p class="seat-number"><i class="pi pi-user"></i> Seat: {{ reservation.seat.seatNumber }}</p>
                <p class="location">
                  <i class="pi pi-map-marker"></i>
                  {{ reservation.seat.room.floor.building.name }} -
                  {{ reservation.seat.room.floor.name }}
                </p>
              </div>
              <p-tag
                [value]="reservation.status"
                [severity]="getStatusSeverity(reservation.status)"
              ></p-tag>
            </div>
          </ng-template>

          <ng-template #content>
            <div class="reservation-details">
              <div class="detail">
                <span class="label"><i class="pi pi-calendar"></i> Date:</span>
                <span class="value">{{ reservation.reservationDate | date:'fullDate' }}</span>
              </div>
              <div class="detail" *ngIf="reservation.startTime">
                <span class="label"><i class="pi pi-clock"></i> Time:</span>
                <span class="value">{{ reservation.startTime }} - {{ reservation.endTime }}</span>
              </div>
              <div class="detail" *ngIf="reservation.bookEntireRoom">
                <span class="label"><i class="pi pi-home"></i> Type:</span>
                <span class="value">Entire Room</span>
              </div>
            </div>

            <p-divider *ngIf="reservation.weather || reservation.traffic?.available"></p-divider>

            <div class="weather-info" *ngIf="reservation.weather">
              <h4><i class="pi pi-cloud"></i> Weather</h4>
              <div class="weather-details">
                <p-badge [value]="reservation.weather.temperature + '°C'"></p-badge>
                <p-badge [value]="reservation.weather.description"></p-badge>
                <p-badge [value]="reservation.weather.humidity + '%'" icon="pi pi-droplet"></p-badge>
              </div>
            </div>

            <div class="traffic-info" *ngIf="reservation.traffic?.available">
              <h4><i class="pi pi-car"></i> Traffic</h4>
              <div class="traffic-details">
                <p-badge [value]="reservation.traffic?.estimatedTravelTimeMinutes + ' min'" icon="pi pi-clock"></p-badge>
                <p-badge [value]="reservation.traffic?.distanceKm + ' km'" icon="pi pi-map"></p-badge>
                <p-badge [value]="reservation.traffic?.trafficLevel || ''" severity="info"></p-badge>
              </div>
            </div>
          </ng-template>

          <ng-template #footer *ngIf="reservation.status === 'ACTIVE'">
            <div class="reservation-actions">
              <p-button
                (onClick)="cancelReservation(reservation.id)"
                label="Cancel Reservation"
                icon="pi pi-times"
                severity="danger"
                size="small"
              ></p-button>
            </div>
          </ng-template>
        </p-card>
      </div>

      <div class="no-reservations" *ngIf="!loading() && reservations().length === 0">
        <p-card>
          <ng-template #content>
            <div class="no-reservations-content">
              <i class="pi pi-calendar-times" style="font-size: 4rem; color: #ccc;"></i>
              <p>You don't have any reservations yet.</p>
              <p-button
                routerLink="/dashboard"
                label="Book a Seat"
                icon="pi pi-plus"
                severity="primary"
              ></p-button>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .reservations-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: #333;
      }
    }

    .reservations-list {
      display: grid;
      gap: 1.5rem;
    }

    .reservation-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }

      &.cancelled {
        opacity: 0.7;
        background: #f8f9fa;
      }

      &.completed {
        opacity: 0.8;
        background: #f0f0f0;
      }
    }

    .reservation-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;

      h3 {
        font-size: 1.5rem;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      .seat-number {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.25rem;
      }

      .location {
        color: #666;
        font-size: 0.9rem;
      }
    }

    .reservation-status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      height: fit-content;

      &.active {
        background: #d4edda;
        color: #155724;
      }

      &.cancelled {
        background: #f8d7da;
        color: #721c24;
      }

      &.completed {
        background: #d1ecf1;
        color: #0c5460;
      }
    }

    .reservation-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;

      .detail {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .label {
          font-size: 0.9rem;
          color: #666;
        }

        .value {
          font-weight: 600;
          color: #333;
        }
      }
    }

    .weather-info,
    .traffic-info {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;

      h4 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: #333;
      }
    }

    .weather-details,
    .traffic-details {
      display: flex;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: #555;
    }

    .reservation-actions {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }

    .btn-danger {
      background: #dc3545;
      color: white;

      &:hover {
        background: #c82333;
      }
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .no-reservations {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;

      p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
      }
    }

    .loading,
    .error {
      text-align: center;
      padding: 2rem;
      font-size: 1.1rem;
    }

    .error {
      color: #dc3545;
    }
  `]
})
export class ReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  reservations = signal<Reservation[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading.set(true);
    this.error.set(null);

    this.reservationService.getAllReservations()
      .subscribe({
        next: (response) => {
          this.reservations.set(response.reservations);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load reservations');
          this.loading.set(false);
          console.error(err);
        }
      });
  }

  getStatusSeverity(status: string): 'success' | 'danger' | 'info' | 'warn' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'CANCELLED': return 'danger';
      case 'COMPLETED': return 'info';
      default: return 'secondary';
    }
  }

  cancelReservation(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this reservation?',
      header: 'Confirm Cancellation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.reservationService.deleteReservation(id)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Reservation cancelled successfully'
              });
              this.loadReservations();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to cancel reservation'
              });
              console.error(err);
            }
          });
      }
    });
  }
}
