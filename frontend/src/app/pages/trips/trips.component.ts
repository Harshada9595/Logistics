import { Component, OnInit } from '@angular/core';
import { Trip, Driver, Vehicle } from '../../models';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { DriverService } from '../../services/driver.service';
import { VehicleService } from '../../services/vehicle.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-trip',
  standalone: true, 
  imports: [ CommonModule, FormsModule ],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripComponent implements OnInit {
  trips: Trip[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];


  newTrip: Partial<Trip> = { destination: '', driverId: null, vehicleId: null, status: 'Pending' };
  selectedTrip: Trip | null = null;

  constructor(
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadTrips();
    this.loadDrivers();
    this.loadVehicles();
  }

  loadTrips(): void {
    this.tripService.getTrips().subscribe((data) => { this.trips = data; });
  }

  loadDrivers(): void {

    this.driverService.getAvailableDrivers().subscribe((data) => { this.drivers = data; });
  }

  loadVehicles(): void {
    
    this.vehicleService.getAvailableVehicles().subscribe((data) => { this.vehicles = data; });
  }

  addTrip(): void {
    
    const tripPayload = {
      destination: this.newTrip.destination,
      driverId: this.newTrip.driverId || 0, 
      vehicleId: this.newTrip.vehicleId || 0,
      status: this.newTrip.status
    };

    this.tripService.createTrip(tripPayload).subscribe({
      next: () => {
         // The backend should handle setting availability now
         this.loadTrips();
         // Reset the form
         this.newTrip = { destination: '', driverId: null, vehicleId: null, status: 'Pending' };
         // Refresh driver/vehicle lists because availability status might have changed
         this.loadDrivers();
         this.loadVehicles();
      },
      error: (err: HttpErrorResponse) => { console.error('Error adding trip:', err); }
    });
  }

  editTrip(trip: Trip): void {
    this.selectedTrip = { ...trip };
  }

  updateTrip(): void {
    if (this.selectedTrip) {
      // FIX: Call the update service method, not the create method
      this.tripService.updateTrip(this.selectedTrip.id, this.selectedTrip).subscribe({
        next: () => {
          this.selectedTrip = null;
          this.loadTrips();
        },
        error: (err: HttpErrorResponse) => { console.error('Error updating trip:', err); }
      });
    }
  }

  deleteTrip(id: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.tripService.deleteTrip(id).subscribe({
        next: () => {
          this.loadTrips();
        },
        error: (err: HttpErrorResponse) => { console.error('Error deleting trip:', err); }
      });
    }
  }

  getDriverName(driverId: number | null): string {
    // Assumes Driver model uses 'id' property (lowercase)
    const driver = this.drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'N/A';
  }

  getVehicleModel(vehicleId: number | null): string {
    // Assumes Vehicle model uses 'id' property (lowercase)
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.model} (${vehicle.licensePlate})` : 'N/A';
  }
}
