import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../../ReusableComponents/navbar/navbar';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, Navbar, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

    onSubmit(): void {
    const loginData = this.loginForm.value;

    // Step 1: Hit /login API
    this.http.post('http://localhost:8080/login', loginData, { responseType: 'text' }).subscribe({
      next: (response: string) => {
        if (response === 'Login successful') {
          this.http.get<any[]>('http://localhost:8080/users').subscribe({
            next: (users) => {
              const foundUser = users.find(u => u.email === loginData.email);
              if (foundUser) {
                localStorage.setItem('userId', foundUser.id);
                localStorage.setItem('isLoggedIn', 'true');
                alert("Login Successful");
                this.router.navigate(['/home']);
              } else {
                this.errorMessage = 'User not found after login';
              }
            },
            error: () => {
              this.errorMessage = 'Unable to fetch user details';
            }
          });
        } else {
          this.errorMessage = response;
        }
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Try again.';
        console.error("Login error:", error);
      }
    });
  }

  // onSubmit(): void {
  //   const loginData = this.loginForm.value;

  //   this.http.post<any>('http://localhost:8080/login', loginData).subscribe({
  //     next: (response) => {
  //       if (response === 'Login successful') {
  //         this.router.navigate(['/home']);
  //       } else {
  //         this.errorMessage = response;
  //       }

  //       if (response === 'Login successful') {
  //         localStorage.setItem('isLoggedIn', 'true');
  //         this.router.navigate(['/home']);
  //       }
  //       if(response === 'Login successful'){
  //         alert("Login Successful");
  //       }

  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Login failed. Try again.';
  //       console.error("Login error:", error);
  //     }
  //   })

  // }
}
