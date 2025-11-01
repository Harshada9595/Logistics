import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehicleComponent implements OnInit {
  newVehicle: Vehicle = { id: 0, model: '', licensePlate: '', isAvailable: true };
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe((data) => {
      this.vehicles = data;
    });
  }

  addVehicle(): void {
    const vehiclePayload = {
      model: this.newVehicle.model,
      licensePlate: this.newVehicle.licensePlate,
      isAvailable: this.newVehicle.isAvailable
    };

    this.vehicleService.createVehicle(vehiclePayload).subscribe({
      next: () => {
        this.loadVehicles();
        this.newVehicle = { id: 0, model: '', licensePlate: '', isAvailable: true };
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error adding vehicle:', err);
      }
    });
  }

  editVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = { ...vehicle };
  }

  updateVehicle(): void {
    if (this.selectedVehicle) {
      const updatePayload = {
        model: this.selectedVehicle.model,
        licensePlate: this.selectedVehicle.licensePlate,
        isAvailable: this.selectedVehicle.isAvailable
      };

      this.vehicleService.updateVehicle(this.selectedVehicle.id, updatePayload).subscribe({
        next: () => {
          this.selectedVehicle = null;
          this.loadVehicles();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating vehicle:', err);
        }
      });
    }
  }

  deleteVehicle(id: number): void {
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => this.loadVehicles(),
      error: (err: HttpErrorResponse) => console.error('Error deleting vehicle:', err)
    });
  }
}
