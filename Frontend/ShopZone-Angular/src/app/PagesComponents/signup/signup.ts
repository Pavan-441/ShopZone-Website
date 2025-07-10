import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registered(){
    alert("Registered Successfully!");
  }

  onSubmit(): void {
    const signupData = this.signupForm.value;

    this.http.post('http://localhost:8080/register', signupData, { responseType: 'text' }).subscribe({
      next: (res) => {
        if (res === 'Registered Successfully') {
          this.successMessage = res;
          setTimeout(() => this.router.navigate(['/login']), 1500); // Redirect after delay
        } else {
          this.errorMessage = res;
        }
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Try again.';
        console.error(err);
      }
    });
  }
}
