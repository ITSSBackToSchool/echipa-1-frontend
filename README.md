# DeskOps Frontend

Modern Angular application for office desk and room booking with integrated weather and traffic information.

## Features

### Employee Features
- 📍 **Smart Desk Booking** - Reserve desks for up to 5 days in advance
- 🌤️ **Weather Forecast** - 5-day weather predictions for office buildings
- 🚗 **Traffic Information** - Real-time traffic updates for your commute
- 📅 **Reservation Management** - View, update, and cancel your bookings
- ⏰ **Time-Based Booking** - Book conference rooms and collaborative spaces by time slots
- 🏢 **Multi-Building Support** - Filter seats by building (T1, T2)

### Admin Features
- ➕ **Room Management** - Create and delete rooms
- 💺 **Seat Management** - Add, update, and delete seats
- 🔧 **Full CRUD Operations** - Complete control over workspace inventory

## Technology Stack

- **Angular 19** - Latest Angular framework with standalone components
- **Auth0** - Secure authentication and authorization
- **RxJS** - Reactive programming with signals
- **SCSS** - Modern styling with component-scoped styles
- **TypeScript** - Type-safe development

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Auth0 account (for authentication)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  auth0: {
    domain: 'YOUR_AUTH0_DOMAIN',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'https://api.deskops.com'
    }
  }
};
```

## Development Server

Run the development server:
```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Build the project for production:
```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Main booking interface
│   │   ├── reservations/       # Reservation list and management
│   │   ├── admin/              # Admin panel for seat/room management
│   │   ├── layout/             # Navigation bar
│   │   └── shared/             # Home page and shared components
│   ├── guards/
│   │   ├── auth.guard.ts       # Authentication guard
│   │   └── admin.guard.ts      # Admin permission guard
│   ├── models/                 # TypeScript interfaces
│   ├── services/               # API services
│   └── app.config.ts           # App configuration with Auth0
└── environments/               # Environment configurations
```

## Authentication & Authorization

The app uses Auth0 for authentication with role-based access control.

## API Integration

The frontend communicates with the Spring Boot backend at `http://localhost:8080/api`

## Running with Backend

1. Start the Spring Boot backend on port 8080
2. Start the Angular frontend on port 4200
3. Login via Auth0
4. Start booking!

## License

MIT License
