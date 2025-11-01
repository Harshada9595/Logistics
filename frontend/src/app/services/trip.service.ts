import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models';

@Injectable({ providedIn: 'root' })
export class TripService {
  private baseUrl = 'http://localhost:5204/api/trips'; // your backend

  constructor(private http: HttpClient) {}

  getTrips(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createTrip(trip: any): Observable<any> {
    return this.http.post(this.baseUrl, trip);
  }

  getActiveTrips(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/active`);
  }

  getCompletedTrips(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/completed`);
  }

  getLongTrips(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/long`);
  }
  

  updateTrip(id: number, trip: Trip): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, trip);
  }

 
  deleteTrip(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
