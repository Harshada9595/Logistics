
import { Component, OnInit } from '@angular/core';
import { Driver } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriverComponent implements OnInit {
  drivers: Driver[] = [];
  newDriver: Partial<Driver> = { name: '', isAvailable: true };
  selectedDriver: Driver | null = null;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe((data) => {
      this.drivers = data;
    });
  }

  addDriver(): void {
    const driverPayload = { name: this.newDriver.name, isAvailable: this.newDriver.isAvailable };
    this.driverService.createDriver(driverPayload as Driver).subscribe({
      next: () => {
        this.loadDrivers();
        this.newDriver = { name: '', isAvailable: true };
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error adding driver:', err);
        if (err.error) {
          console.error('Backend validation error:', err.error);
        }
      }
    });
  }

  editDriver(driver: Driver): void {
    this.selectedDriver = { ...driver };
  }

  updateDriver(): void {
    if (this.selectedDriver) {
      // DEBUG: Log the ID and availability status before the API call
      console.log("Attempting to update driver ID:", this.selectedDriver.id, "Availability:", this.selectedDriver.isAvailable);

      // FIX: Removed the duplicated 'this.driverService'
      this.driverService
        .updateDriverAvailability(this.selectedDriver.id, this.selectedDriver.isAvailable)
        .subscribe({
          next: () => {
            console.log("Driver availability updated successfully.");
            this.loadDrivers(); // Reload the list to reflect the change
            this.selectedDriver = null;
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error updating driver availability:', err);
            if (err.error) {
              // The 400 Bad Request usually means the backend rejected the data/URL
              console.error('Backend validation error details:', err.error);
            }
          }
        });
    } else {
      console.warn("No driver selected for update.");
    }
  }


  deleteDriver(id: number): void {
    this.driverService.deleteDriver(id).subscribe({
      next: () => {
        this.loadDrivers();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error deleting driver:', err);
        if (err.error) {
          console.error('Backend error:', err.error);
        }
      }
    });
  }
}

