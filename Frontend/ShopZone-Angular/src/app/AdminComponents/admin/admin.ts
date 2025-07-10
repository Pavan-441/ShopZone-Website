import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  loginForm: FormGroup;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['admin@shopzone.com', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.clearMessage();

    if (this.loginForm.invalid) {
      this.showMessage('Please enter valid email and password.', 'error');
      return;
    }

    const loginData = this.loginForm.value;

    this.http.post<any>('http://localhost:8080/admin', loginData).subscribe({
      next: (response) => {
        if (response && response.message === 'Login successful') {
          localStorage.setItem('isAdminLoggedIn', 'true');
          localStorage.setItem('adminEmail', loginData.email);

          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userId');
          this.showMessage('Admin login successful! Redirecting...', 'success');
          this.router.navigate(['/admin-home']);
        } else {
          this.showMessage(response.message || 'Invalid credentials.', 'error');
        }
      },
      error: (error) => {
        console.error("Admin Login error:", error);
        this.showMessage(error.error?.message || 'Admin login failed. Please try again.', 'error');
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
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
}
 