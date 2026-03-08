import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface Notification {
  id: number;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent {
  readonly navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'DB' },
    { label: 'Employees', route: '/employees', icon: 'EM' },
    { label: 'Reviews', route: '/reviews', icon: 'RV' },
    { label: 'Goals', route: '/goals', icon: 'GL' },
    { label: 'Reports', route: '/reports', icon: 'RP' }
  ];

  notifOpen = false;

  notifications: Notification[] = [
    { id: 1, message: 'Mia Patel completed her Q1 review.', time: '2 min ago', icon: '✅', read: false },
    { id: 2, message: 'New employee Liam Brooks added.', time: '1 hr ago', icon: '👤', read: false },
    { id: 3, message: 'Ava Carter has a pending review.', time: '3 hrs ago', icon: '⏳', read: false },
    { id: 4, message: 'Noah Walker reached goal milestone.', time: 'Yesterday', icon: '🎯', read: true },
    { id: 5, message: 'Monthly performance report ready.', time: 'Yesterday', icon: '📊', read: true },
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get todayDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  toggleNotif(): void {
    this.notifOpen = !this.notifOpen;
  }

  closeNotif(): void {
    this.notifOpen = false;
  }

  markRead(n: Notification): void {
    n.read = true;
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
  }
}