import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherData } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/weather`;

  getWeatherForDate(buildingId: number, date: string): Observable<WeatherData> {
    const params = new HttpParams().set('date', date);
    return this.http.get<WeatherData>(`${this.apiUrl}/building/${buildingId}`, { params });
  }

  getWeatherForecast(buildingId: number, days: number = 5): Observable<WeatherData[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<WeatherData[]>(`${this.apiUrl}/building/${buildingId}/forecast`, { params });
  }
}