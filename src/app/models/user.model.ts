export interface User {
  id: number;
  auth0UserId: string;
  name: string;
  email: string;
  homeStreet?: string;
  homeStreetNumber?: number;
  homeCity?: string;
}