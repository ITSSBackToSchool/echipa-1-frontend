import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, ButtonModule, AvatarModule],
  template: `
    <p-menubar [model]="menuItems()" styleClass="custom-menubar">
      <ng-template #start>
        <a routerLink="/" class="logo-link">
          <i class="pi pi-map-marker logo-icon"></i>
          <span class="logo-text">DeskOps</span>
        </a>
      </ng-template>
      <ng-template #end>
        <div class="navbar-actions">
          <div *ngIf="auth.isAuthenticated$ | async; else loginButton" class="user-menu">
            <p-avatar
              [label]="(auth.user$ | async)?.name?.charAt(0) || 'U'"
              shape="circle"
              styleClass="mr-2"
            ></p-avatar>
            <span class="user-name">{{ (auth.user$ | async)?.name }}</span>
            <p-button
              (onClick)="logout()"
              label="Logout"
              icon="pi pi-sign-out"
              [outlined]="true"
              severity="secondary"
              size="small"
              styleClass="ml-3"
            ></p-button>
          </div>
          <ng-template #loginButton>
            <p-button
              (onClick)="login()"
              label="Login"
              icon="pi pi-sign-in"
              severity="primary"
            ></p-button>
          </ng-template>
        </div>
      </ng-template>
    </p-menubar>
  `,
  styles: [`
    :host ::ng-deep .custom-menubar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 0;
      padding: 0.5rem 2rem;
    }

    :host ::ng-deep .custom-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-content .p-menuitem-link {
      color: white;
    }

    :host ::ng-deep .custom-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-content .p-menuitem-link:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      margin-right: 2rem;
    }

    .logo-icon {
      font-size: 1.8rem;
      margin-right: 0.5rem;
    }

    .logo-text {
      font-weight: 700;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      font-weight: 500;
      color: white;
    }

    :host ::ng-deep .p-avatar {
      background-color: rgba(255, 255, 255, 0.3);
      color: white;
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  permissions$ = this.auth.idTokenClaims$.pipe(
    map(claims => claims?.['permissions'] || [])
  );

  menuItems = signal<any[]>([
    {
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      routerLink: '/dashboard',
      visible: true
    },
    {
      label: 'My Reservations',
      icon: 'pi pi-calendar',
      routerLink: '/reservations',
      visible: true
    },
    {
      label: 'Admin',
      icon: 'pi pi-cog',
      routerLink: '/admin',
      visible: true
    }
  ]);

  constructor() {
    // Update menu visibility based on auth state
    this.auth.isAuthenticated$.subscribe(isAuth => {
      const items = this.menuItems();
      items.forEach(item => {
        if (item.label !== 'Admin') {
          item.visible = isAuth;
        }
      });
    });

    // Update admin menu visibility based on permissions
    this.permissions$.subscribe(permissions => {
      const items = this.menuItems();
      const adminItem = items.find(i => i.label === 'Admin');
      if (adminItem) {
        adminItem.visible = permissions.includes('MANAGE_ROOMS');
      }
    });
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }
}