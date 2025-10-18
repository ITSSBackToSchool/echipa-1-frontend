import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TrafficData } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class TrafficService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/traffic`;

  getTrafficRecommendation(buildingId: number): Observable<{ traffic: TrafficData }> {
    const params = new HttpParams().set('buildingId', buildingId.toString());
    return this.http.get<{ traffic: TrafficData }>(this.apiUrl, { params });
  }
}