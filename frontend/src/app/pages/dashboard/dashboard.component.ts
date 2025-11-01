// import { Component, OnInit } from '@angular/core';
// import { TripService } from '../../services/trip.service';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { BaseChartDirective } from 'ng2-charts';
// import { VehicleService } from '../../services/vehicle.service';

// @Component({
//   selector: 'app-dashboard',
//    imports: [
//     CommonModule,
//     MatCardModule,
//     BaseChartDirective 
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
  
// })
// export class DashboardComponent implements OnInit {
//   stats = [
//     { title: 'Active Trips', value: 0 },
//     { title: 'Completed Trips', value: 0 },
//     { title: 'Vehicles Available', value: 0 },
//     { title: 'Trips > 8 Hours', value: 0 },
//   ];

//   tripChartData = [0, 0];
//   tripChartLabels = ['Active', 'Completed'];

//   constructor(private tripService: TripService, private vehicleService: VehicleService) {}

//   ngOnInit() {
//     this.tripService.getActiveTrips().subscribe(a => {
//       this.stats[0].value = a.length;
//       this.tripChartData[0] = a.length;
//     });
//     this.tripService.getCompletedTrips().subscribe(c => {
//       this.stats[1].value = c.length;
//       this.tripChartData[1] = c.length;
//     });
//     this.vehicleService.getVehicles().subscribe(vs => {
//       this.stats[2].value = vs.filter(v => v.isAvailable).length;
//     });
//     this.tripService.getLongTrips().subscribe(l => {
//       this.stats[3].value = l.length;
//     });
//   }
// }
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { TripService } from '../../services/trip.service';
import { VehicleService } from '../../services/vehicle.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Set to true for standalone mode
  imports: [
    CommonModule,
    MatCardModule,
    BaseChartDirective // Import the ng2-charts directive
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  stats = [
    { title: 'Active Trips', value: 0 },
    { title: 'Completed Trips', value: 0 },
    { title: 'Vehicles Available', value: 0 },
    { title: 'Trips > 8 Hours', value: 0 },
  ];

  public tripChartType: ChartType = 'doughnut';

  public tripChartData: ChartData<'doughnut'> = {
    labels: ['Active', 'Completed'],
    datasets: [{
      data: [0, 0],
      label: 'Trip Status',
      backgroundColor: ['#FFC107', '#4CAF50'],
      hoverBackgroundColor: ['#FFD54F', '#66BB6A']
    }]
  };

  constructor(
    private tripService: TripService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    combineLatest([
      this.tripService.getActiveTrips(),
      this.tripService.getCompletedTrips()
    ]).subscribe(([activeTrips, completedTrips]) => {
      this.stats[0].value = activeTrips.length;
      this.stats[1].value = completedTrips.length;

      // Update the chart data
      this.tripChartData.datasets[0].data = [activeTrips.length, completedTrips.length];
      
      // Update the chart view
      if (this.chart) {
        this.chart.update();
      }
    });

    this.vehicleService.getVehicles().subscribe(vs => {
      this.stats[2].value = vs.filter(v => v.isAvailable).length;
    });

    this.tripService.getLongTrips().subscribe(l => {
      this.stats[3].value = l.length;
    });
  }
}
