export interface Building {
  id: number;
  name: string;
}

export interface Floor {
  id: number;
  name: string;
  buildingId: number;
}

export interface Location {
  id: number;
  buildingId: number;
  city: string;
  district?: string;
  latitude: number;
  longitude: number;
  address: string;
}