import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeatService } from '../../services/seat.service';
import { RoomService } from '../../services/room.service';
import { Seat, CreateSeatRequest, UpdateSeatRequest } from '../../models/seat.model';
import { Room, CreateRoomRequest, RoomType } from '../../models/room.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    FloatLabelModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="admin-container">
      <h1><i class="pi pi-cog"></i> Admin Panel</h1>

      <div class="admin-sections">
        <!-- Seat Management -->
        <div class="admin-section">
          <h2>Seat Management</h2>

          <!-- Add Seat Form -->
          <div class="form-card">
            <h3>Add New Seat</h3>
            <div class="form-group">
              <label>Seat Number</label>
              <input type="text" [(ngModel)]="newSeat.seatNumber" class="form-control" placeholder="e.g., Desk 1" />
            </div>
            <div class="form-group">
              <label>Room ID</label>
              <input type="number" [(ngModel)]="newSeat.roomId" class="form-control" placeholder="e.g., 1" />
            </div>
            <button (click)="addSeat()" class="btn btn-primary" [disabled]="loading()">
              {{ loading() ? 'Adding...' : 'Add Seat' }}
            </button>
          </div>

          <!-- List Seats -->
          <div class="list-card">
            <h3>All Seats</h3>
            <button (click)="loadSeats()" class="btn btn-secondary btn-sm">Refresh</button>
            <div class="seats-list" *ngIf="seats().length > 0">
              <div *ngFor="let seat of seats()" class="item-row">
                <div class="item-info">
                  <strong>{{ seat.seatNumber }}</strong>
                  <span class="item-meta">Room: {{ seat.room?.name || seat.roomId }}</span>
                </div>
                <div class="item-actions">
                  <button (click)="editSeat(seat)" class="btn btn-sm btn-secondary">Edit</button>
                  <button (click)="deleteSeat(seat.id)" class="btn btn-sm btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Seat Form -->
          <div class="form-card" *ngIf="editingSeat()">
            <h3>Edit Seat #{{ editingSeat()!.id }}</h3>
            <div class="form-group">
              <label>Seat Number</label>
              <input type="text" [(ngModel)]="updateSeatData.seatNumber" class="form-control" />
            </div>
            <div class="form-group">
              <label>Room ID</label>
              <input type="number" [(ngModel)]="updateSeatData.roomId" class="form-control" />
            </div>
            <div class="button-group">
              <button (click)="updateSeat()" class="btn btn-primary" [disabled]="loading()">
                {{ loading() ? 'Updating...' : 'Update Seat' }}
              </button>
              <button (click)="cancelEdit()" class="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Room Management -->
        <div class="admin-section">
          <h2>Room Management</h2>

          <!-- Add Room Form -->
          <div class="form-card">
            <h3>Add New Room</h3>
            <div class="form-group">
              <label>Room Name</label>
              <input type="text" [(ngModel)]="newRoom.name" class="form-control" placeholder="e.g., Conference Room A" />
            </div>
            <div class="form-group">
              <label>Room Type</label>
              <select [(ngModel)]="newRoom.roomType" class="form-control">
                <option [value]="RoomType.DESK_ROOM">Desk Room</option>
                <option [value]="RoomType.CONFERENCE_ROOM">Conference Room</option>
                <option [value]="RoomType.COLLABORATIVE">Collaborative</option>
                <option [value]="RoomType.RECREATIONAL">Recreational</option>
              </select>
            </div>
            <div class="form-group">
              <label>Seat Count</label>
              <input type="number" [(ngModel)]="newRoom.seatCount" class="form-control" placeholder="e.g., 10" />
            </div>
            <div class="form-group">
              <label>Floor ID</label>
              <input type="number" [(ngModel)]="newRoom.floorId" class="form-control" placeholder="e.g., 1" />
            </div>
            <button (click)="addRoom()" class="btn btn-primary" [disabled]="loading()">
              {{ loading() ? 'Adding...' : 'Add Room' }}
            </button>
          </div>

          <!-- Delete Room -->
          <div class="form-card">
            <h3>Delete Room</h3>
            <div class="form-group">
              <label>Room ID to Delete</label>
              <input type="number" [(ngModel)]="deleteRoomId" class="form-control" placeholder="e.g., 5" />
            </div>
            <button (click)="deleteRoom()" class="btn btn-danger" [disabled]="loading()">
              {{ loading() ? 'Deleting...' : 'Delete Room' }}
            </button>
            <p class="warning-text">⚠️ This will also delete all seats and reservations in this room!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;

      h1 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 2rem;
      }
    }

    .admin-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
    }

    .admin-section {
      h2 {
        font-size: 1.8rem;
        color: #667eea;
        margin-bottom: 1.5rem;
      }
    }

    .form-card,
    .list-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;

      h3 {
        font-size: 1.3rem;
        color: #333;
        margin-bottom: 1.5rem;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #333;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #667eea;
        }
      }
    }

    .button-group {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }

    .btn-secondary {
      background: #6c757d;
      color: white;

      &:hover:not(:disabled) {
        background: #5a6268;
      }
    }

    .btn-danger {
      background: #dc3545;
      color: white;

      &:hover:not(:disabled) {
        background: #c82333;
      }
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .seats-list {
      margin-top: 1.5rem;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 0.75rem;

      &:hover {
        background: #f8f9fa;
      }
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      strong {
        color: #333;
      }

      .item-meta {
        font-size: 0.9rem;
        color: #666;
      }
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }

    .warning-text {
      margin-top: 1rem;
      color: #dc3545;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .message {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s;

      &.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      &.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  private seatService = inject(SeatService);
  private roomService = inject(RoomService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  RoomType = RoomType;
  roomTypeOptions = [
    { label: 'Desk Room', value: RoomType.DESK_ROOM },
    { label: 'Conference Room', value: RoomType.CONFERENCE_ROOM },
    { label: 'Collaborative', value: RoomType.COLLABORATIVE },
    { label: 'Recreational', value: RoomType.RECREATIONAL }
  ];

  seats = signal<Seat[]>([]);
  loading = signal(false);

  newSeat: CreateSeatRequest = { seatNumber: '', roomId: 0 };
  newRoom: CreateRoomRequest = { name: '', roomType: RoomType.DESK_ROOM, seatCount: 0, floorId: 0 };
  deleteRoomId: number | null = null;

  editingSeat = signal<Seat | null>(null);
  updateSeatData: UpdateSeatRequest = {};

  ngOnInit() {
    this.loadSeats();
  }

  loadSeats() {
    this.seatService.getAllSeats().subscribe({
      next: (seats) => this.seats.set(seats),
      error: (err) => this.showError('Failed to load seats')
    });
  }

  addSeat() {
    if (!this.newSeat.seatNumber || !this.newSeat.roomId) {
      this.showError('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.seatService.createSeat(this.newSeat).subscribe({
      next: () => {
        this.showSuccess('Seat added successfully');
        this.newSeat = { seatNumber: '', roomId: 0 };
        this.loadSeats();
        this.loading.set(false);
      },
      error: (err) => {
        this.showError('Failed to add seat');
        this.loading.set(false);
      }
    });
  }

  editSeat(seat: Seat) {
    this.editingSeat.set(seat);
    this.updateSeatData = { seatNumber: seat.seatNumber, roomId: seat.roomId };
  }

  updateSeat() {
    const seat = this.editingSeat();
    if (!seat) return;

    this.loading.set(true);
    this.seatService.updateSeat(seat.id, this.updateSeatData).subscribe({
      next: () => {
        this.showSuccess('Seat updated successfully');
        this.cancelEdit();
        this.loadSeats();
        this.loading.set(false);
      },
      error: (err) => {
        this.showError('Failed to update seat');
        this.loading.set(false);
      }
    });
  }

  cancelEdit() {
    this.editingSeat.set(null);
    this.updateSeatData = {};
  }

  deleteSeat(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure? This will delete all reservations for this seat.',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.loading.set(true);
        this.seatService.deleteSeat(id).subscribe({
          next: () => {
            this.showSuccess('Seat deleted successfully');
            this.loadSeats();
            this.loading.set(false);
          },
          error: (err) => {
            this.showError('Failed to delete seat');
            this.loading.set(false);
          }
        });
      }
    });
  }

  addRoom() {
    if (!this.newRoom.name || !this.newRoom.seatCount || !this.newRoom.floorId) {
      this.showError('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.roomService.createRoom(this.newRoom).subscribe({
      next: () => {
        this.showSuccess('Room added successfully');
        this.newRoom = { name: '', roomType: RoomType.DESK_ROOM, seatCount: 0, floorId: 0 };
        this.loading.set(false);
      },
      error: (err) => {
        this.showError('Failed to add room');
        this.loading.set(false);
      }
    });
  }

  deleteRoom() {
    if (!this.deleteRoomId) {
      this.showError('Please enter a room ID');
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure? This will delete the room, all its seats, and all reservations!',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.loading.set(true);
        this.roomService.deleteRoom(this.deleteRoomId!).subscribe({
          next: () => {
            this.showSuccess('Room deleted successfully');
            this.deleteRoomId = null;
            this.loadSeats();
            this.loading.set(false);
          },
          error: (err) => {
            this.showError('Failed to delete room');
            this.loading.set(false);
          }
        });
      }
    });
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }
}