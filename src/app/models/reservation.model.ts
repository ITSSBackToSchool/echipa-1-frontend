export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Reservation {
  id: number;
  reservationDate: string;
  startTime?: string;
  endTime?: string;
  bookEntireRoom: boolean;
  status: ReservationStatus;
  seat: {
    id: number;
    seatNumber: string;
    room: {
      id: number;
      name: string;
      roomType: string;
      floor: {
        id: number;
        name: string;
        building: {
          id: number;
          name: string;
        };
      };
    };
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  weather?: WeatherData;
  traffic?: TrafficData;
}

export interface CreateReservationRequest {
  seatIds: number[];
  reservationDate: string;
  startTime?: string;
  endTime?: string;
  bookEntireRoom?: boolean;
}

export interface UpdateReservationRequest {
  seatId?: number;
  reservationDate?: string;
  startTime?: string;
  endTime?: string;
}

export interface CreateReservationResponse {
  reservations: Reservation[];
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  date: string;
  icon?: string;
}

export interface TrafficData {
  available: boolean;
  unavailableReason?: string;
  estimatedTravelTimeMinutes?: number;
  distanceKm?: number;
  trafficLevel?: string;
  departureTime?: string;
  arrivalTime?: string;
}