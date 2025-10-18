import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateReservationRequest,
  CreateReservationResponse,
  UpdateReservationRequest
} from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reservations`;

  createReservation(request: CreateReservationRequest): Observable<CreateReservationResponse> {
    return this.http.post<CreateReservationResponse>(this.apiUrl, request);
  }

  getAllReservations(): Observable<CreateReservationResponse> {
    return this.http.get<CreateReservationResponse>(this.apiUrl);
  }

  getReservation(id: number): Observable<CreateReservationResponse> {
    return this.http.get<CreateReservationResponse>(`${this.apiUrl}/${id}`);
  }

  updateReservation(id: number, request: UpdateReservationRequest): Observable<CreateReservationResponse> {
    return this.http.put<CreateReservationResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}