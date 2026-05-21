import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login-popup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-popup.html',
  styleUrls: ['./login-popup.css']
})
export class LoginPopup {

  @Output() loginResult = new EventEmitter<any>();
  @Output() forgotResult = new EventEmitter<any>(); // ✅ ADD THIS
  @Output() close = new EventEmitter();

  email = '';
  password = '';

  isForgotMode = false;
  isLoading = false;

  constructor(private api: ApiService) { }

  // ---------------- LOGIN ----------------
  login() {

    if (this.isLoading) return;

    this.isLoading = true;

    this.api.login(this.email, this.password).subscribe({

      next: (res: any) => {

        this.isLoading = false;

        // ✅ DEFINE BOTH
        const token = res?.data?.token;
        const role = res?.data?.role;

        // ✅ STORE TOKEN
        if (token) {
          localStorage.setItem('token', token);
        }

        // ✅ STORE ROLE
        if (role) {
          localStorage.setItem('role', role);
        }

        // ✅ EMIT RESPONSE
        this.loginResult.emit(res);
      },

      error: (err) => {

        this.isLoading = false;

        this.loginResult.emit({
          status: 'error',
          message: err?.error?.message || 'Server error'
        });
      }

    });
  }

  // ---------------- FORGOT PASSWORD ----------------
  submitForgot() {

    if (!this.email) {
      alert("Please enter email");
      return;
    }

    this.api.forgotPassword({ email: this.email }).subscribe({
      next: (res: any) => {

        this.forgotResult.emit({
          status: 'success',
          message: res?.message || 'Reset link sent to email'
        });
      },

      error: (err) => {

        this.forgotResult.emit({
          status: 'error',
          message: err?.error?.message || 'Something went wrong'
        });
      }
    });
  }

  // 🔁 switch modes
  openForgot() {
    this.isForgotMode = true;
  }

  backToLogin() {
    this.isForgotMode = false;
  }

  closePopup() {
    this.close.emit();
  }
}