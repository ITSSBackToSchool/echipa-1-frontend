import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Room, CreateRoomRequest, RoomAvailabilityResponse } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rooms`;

  createRoom(request: CreateRoomRequest): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, request);
  }

  getRoomAvailability(roomId: number, date: string): Observable<RoomAvailabilityResponse> {
    const params = new HttpParams().set('date', date);
    return this.http.get<RoomAvailabilityResponse>(`${this.apiUrl}/${roomId}/availability`, { params });
  }

  deleteRoom(roomId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roomId}`);
  }
}