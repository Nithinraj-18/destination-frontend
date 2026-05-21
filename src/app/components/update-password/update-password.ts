import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.css']
})
export class UpdatePasswordComponent {

  email = '';
  oldPassword = '';
  newPassword = '';

  message = '';
  isSuccess = false;

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef
  ) {}

  // 🔐 UPDATE PASSWORD
  updatePassword() {

    if (!this.email || !this.oldPassword || !this.newPassword) {
      this.message = "All fields required";
      this.isSuccess = false;
      return;
    }

    this.api.updatePassword({
      email: this.email,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }).subscribe({

      next: (res: any) => {
        this.message = res?.message || "Success";
        this.isSuccess = res?.status !== 'error';

        this.cd.detectChanges(); // 🔥 instant UI update
      },

      error: (err) => {
        this.message = err?.error?.message || "Server error";
        this.isSuccess = false;

        this.cd.detectChanges();
      }

    });
  }

  // 🧹 CLEAR FORM
  clearForm() {
    this.email = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.message = '';
  }
}