import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SeatService } from '../../services/seat.service';
import { ReservationService } from '../../services/reservation.service';
import { WeatherService } from '../../services/weather.service';
import { TrafficService } from '../../services/traffic.service';
import { Seat } from '../../models/seat.model';
import { CreateReservationRequest, TrafficData } from '../../models/reservation.model';
import { WeatherData } from '../../models/reservation.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    CheckboxModule,
    MessageModule,
    DividerModule,
    BadgeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private seatService = inject(SeatService);
  private reservationService = inject(ReservationService);
  private weatherService = inject(WeatherService);
  private trafficService = inject(TrafficService);
  private router = inject(Router);

  availableSeats = signal<Seat[]>([]);
  selectedSeats = signal<number[]>([]);
  selectedDate = signal<Date | string | null>(null);
  selectedBuildingId = signal<number | undefined>(undefined);
  weatherForecast = signal<WeatherData[]>([]);
  trafficData = signal<TrafficData | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // For time-based rooms
  startTime = signal<string>('');
  endTime = signal<string>('');
  bookEntireRoom = signal(false);

  ngOnInit() {
    // Set default date to today
    const today = new Date();
    this.selectedDate.set(today);

    // Set min and max dates
    this.minDate = today;
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 5); // 5 days maximum
    this.maxDate = maxDate;

    this.loadWeatherForecast();
  }

  minDate: Date = new Date();
  maxDate: Date = new Date();

  getDateString(date: Date | string | null): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  }

  loadAvailableSeats() {
    if (!this.selectedDate()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const dateString = this.getDateString(this.selectedDate());
    this.seatService.getAvailableSeats(dateString, this.selectedBuildingId())
      .subscribe({
        next: (seats) => {
          this.availableSeats.set(seats);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load available seats');
          this.loading.set(false);
          console.error(err);
        }
      });
  }

  loadWeatherForecast() {
    const buildingId = this.selectedBuildingId() || 1; // Default to building 1
    this.weatherService.getWeatherForecast(buildingId, 5)
      .subscribe({
        next: (forecast) => {
          this.weatherForecast.set(forecast);
        },
        error: (err) => {
          console.error('Failed to load weather forecast', err);
        }
      });

    // Also load traffic data
    this.loadTrafficData(buildingId);
  }

  loadTrafficData(buildingId: number) {
    this.trafficService.getTrafficRecommendation(buildingId)
      .subscribe({
        next: (response) => {
          this.trafficData.set(response.traffic);
        },
        error: (err) => {
          console.error('Failed to load traffic data', err);
          // Set unavailable traffic data
          this.trafficData.set({
            available: false,
            unavailableReason: err.error?.message || 'Traffic data not available'
          });
        }
      });
  }

  toggleSeatSelection(seatId: number) {
    const current = this.selectedSeats();
    if (current.includes(seatId)) {
      this.selectedSeats.set(current.filter(id => id !== seatId));
    } else {
      this.selectedSeats.set([...current, seatId]);
    }
  }

  isSeatSelected(seatId: number): boolean {
    return this.selectedSeats().includes(seatId);
  }

  createReservation() {
    if (this.selectedSeats().length === 0) {
      this.error.set('Please select at least one seat');
      return;
    }

    const request: CreateReservationRequest = {
      seatIds: this.selectedSeats(),
      reservationDate: this.getDateString(this.selectedDate()),
      startTime: this.startTime() || undefined,
      endTime: this.endTime() || undefined,
      bookEntireRoom: this.bookEntireRoom()
    };

    this.loading.set(true);
    this.error.set(null);

    this.reservationService.createReservation(request)
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          alert(`Successfully created ${response.reservations.length} reservation(s)!`);
          this.router.navigate(['/reservations']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Failed to create reservation');
          console.error(err);
        }
      });
  }

  getSeatsByRoom(seats: Seat[]): Map<string, Seat[]> {
    const grouped = new Map<string, Seat[]>();
    seats.forEach(seat => {
      const roomName = seat.room?.name || 'Unknown Room';
      if (!grouped.has(roomName)) {
        grouped.set(roomName, []);
      }
      grouped.get(roomName)!.push(seat);
    });
    return grouped;
  }

  get groupedSeats() {
    return this.getSeatsByRoom(this.availableSeats());
  }
}