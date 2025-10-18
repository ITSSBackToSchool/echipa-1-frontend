export enum RoomType {
  DESK_ROOM = 'DESK_ROOM',
  CONFERENCE_ROOM = 'CONFERENCE_ROOM',
  COLLABORATIVE = 'COLLABORATIVE',
  RECREATIONAL = 'RECREATIONAL'
}

export interface Room {
  id: number;
  name: string;
  roomType: RoomType;
  seatCount: number;
  floorId: number;
}

export interface CreateRoomRequest {
  name: string;
  roomType: RoomType;
  seatCount: number;
  floorId: number;
}

export interface RoomAvailabilityResponse {
  roomId: number;
  roomName: string;
  roomType: string;
  date: string;
  businessHours: {
    start: string;
    end: string;
  };
  timeSlots: TimeSlot[];
  isEntirelyAvailable: boolean;
  isEntirelyBooked: boolean;
  nextAvailableSlot: TimeSlot | null;
  totalAvailableMinutes: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED';
  durationMinutes: number;
  bookedBy?: string;
  bookedByEmail?: string;
  bookingId?: number;
}