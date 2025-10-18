import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Seat, CreateSeatRequest, UpdateSeatRequest } from '../models/seat.model';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/seats`;

  getAllSeats(): Observable<Seat[]> {
    return this.http.get<Seat[]>(this.apiUrl);
  }

  getAvailableSeats(date: string, buildingId?: number): Observable<Seat[]> {
    let params = new HttpParams().set('date', date);
    if (buildingId) {
      params = params.set('buildingId', buildingId.toString());
    }
    return this.http.get<Seat[]>(`${this.apiUrl}/available`, { params });
  }

  createSeat(request: CreateSeatRequest): Observable<Seat> {
    return this.http.post<Seat>(`${this.apiUrl}/add`, request);
  }

  updateSeat(id: number, request: UpdateSeatRequest): Observable<Seat> {
    return this.http.put<Seat>(`${this.apiUrl}/${id}`, request);
  }

  deleteSeat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}