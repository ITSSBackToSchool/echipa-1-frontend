export interface Seat {
  id: number;
  seatNumber: string;
  roomId: number;
  room?: {
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
}

export interface CreateSeatRequest {
  seatNumber: string;
  roomId: number;
}

export interface UpdateSeatRequest {
  seatNumber?: string;
  roomId?: number;
}