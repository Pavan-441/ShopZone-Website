import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';
import { Navbar } from '../../ReusableComponents/navbar/navbar';
import { Footer } from '../../ReusableComponents/footer/footer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  contactForm: any = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  message: string = '';
  messageType: 'success' | 'error' | 'info' | '' = '';

  constructor() {}

  onSubmit(): void {
    this.clearMessage();
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.subject || !this.contactForm.message) {
      this.showMessage('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contactForm.email)) {
      this.showMessage('Please enter a valid email address.', 'error');
      return;
    }

    console.log('Contact form submitted:', this.contactForm);
    this.showMessage('Thank you for your message! We will get back to you soon.', 'success');

    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
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
}
