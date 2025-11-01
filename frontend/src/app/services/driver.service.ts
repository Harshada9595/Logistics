import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private baseUrl = 'http://localhost:5204/api/drivers';

  constructor(private http: HttpClient) {}

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.baseUrl);
  }

  // Create method sends the object without the ID field
  createDriver(driver: Partial<Driver>): Observable<Driver> {
    return this.http.post<Driver>(this.baseUrl, driver);
  }

  // Update method sends the object with the ID in the URL and body
  updateDriver(id: number, driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.baseUrl}/${id}`, driver);
  }

   updateDriverAvailability(id: number, isAvailable: boolean): Observable<any> {
     return this.http.patch(`${this.baseUrl}/${id}/availability`, { isAvailable });
  }
  // Delete method sends the ID in the URL
  deleteDriver(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
   getAvailableDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.baseUrl}/available`);
  }
}
