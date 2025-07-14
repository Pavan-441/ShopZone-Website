import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data-service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-admin-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {
  users: any[] = [];
  message: string = '';
  messageType: 'success' | 'error' | 'info' | '' = '';
  private routerSubscription: Subscription | undefined;
  private usersDataSubscription: Subscription | undefined;


  constructor(private http: HttpClient, private router: Router, private dataService: DataService, private cdr: ChangeDetectorRef) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/admin-home')
    ).subscribe(() => {
      console.log('NavigationEnd event for /admin-home detected. Checking login and loading users...');
      this.checkAdminLoginAndLoadUsers();
    });
  }

  ngOnInit(): void {
    console.log('AdminHome ngOnInit called. Checking login and loading users...');
    this.checkAdminLoginAndLoadUsers();
  }

  ngOnDestroy(): void {
    console.log('AdminHomeComponent: ngOnDestroy called. Unsubscribing from subscriptions.');
    this.routerSubscription?.unsubscribe();
    this.usersDataSubscription?.unsubscribe(); 
  }

  checkAdminLoginAndLoadUsers(): void {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    console.log('checkAdminLoginAndLoadUsers: isAdminLoggedIn from localStorage:', isAdminLoggedIn);

    if (isAdminLoggedIn !== 'true') {
      this.showMessage("Access Denied. Please log in as an admin.", 'error');
      if (this.router.url !== '/admin') {
        this.router.navigate(['/admin']);
      }
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('loadUsers method called.');
    this.usersDataSubscription = this.dataService.getUsers().subscribe({
      next: (data: any[]) => {
        console.log("Fetched users successfully:", data);
        this.users = data;
        this.cdr.detectChanges();
        this.clearMessage();
        if (this.users.length === 0) {
          this.showMessage("No users found in the database.", 'info');
        } else {
          this.clearMessage();
        }
      },
      error: (err) => {
        console.error("Error loading users:", err);
        this.showMessage("Failed to load users: " + (err.error?.message || "Server error. Please check backend."), 'error');
        this.users = [];
      }
    });
  }

  logoutAdmin(): void {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    this.router.navigate(['/admin']);
    this.showMessage("Logged out successfully!", 'success');
  }

  showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }
}