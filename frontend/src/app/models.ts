export interface Trip {
  id: number;
  destination: string;
  driverId: number | null;
  vehicleId: number | null;
  status: string;
}


export interface Driver {
  id: number;
  name: string;
  isAvailable: boolean;
}

export interface Vehicle {
  id: number;
  model: string;
  licensePlate: string;
  isAvailable: boolean;
}

