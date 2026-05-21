import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-create-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-login.html',
  styleUrls: ['./create-login.css']
})
export class CreateLogin implements OnInit {

  username = '';
  email = '';
  password = '';
  message = '';
  isSuccess = false;
  emailError = false;
  createMessage = '';
  createSuccess = false;
  deleteMessage = '';
  deleteSuccess = false;
  monthlyRevenues: any[] = [];
  users: any[] = [];

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.loadMonthlyRevenues();
  }
  

  // EMAIL VALIDATION
  validateEmail() {
    const pattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    this.emailError = !pattern.test(this.email);
  }

  // ================= LOAD USERS =================
  loadUsers() {

    this.api.getUsers().subscribe({
      next: (res: any) => {

        this.users = res;

        // 🔥 FORCE UI UPDATE
        this.cd.detectChanges();

      },
      error: (err) => {
        this.users = [];
        this.cd.detectChanges();
      }
    });

  }

  // ================= LOAD REVENUE DATA =================
  loadMonthlyRevenues() {

    this.api.getMonthlyRevenues().subscribe({
      next: (res: any) => {

        this.monthlyRevenues = res;

        // 🔥 FORCE UI UPDATE
        this.cd.detectChanges();

      },
      error: (err) => {
        this.monthlyRevenues = [];
        this.cd.detectChanges();
      }
    });

  }



  // 🔥 FIXED SUBMIT (NO DOUBLE CLICK ISSUE)
  submit() {

    if (!this.username || !this.email || !this.password) {
      this.setMessage("All fields required", false);
      return;
    }

    if (this.emailError) {
      this.setMessage("Enter valid email", false);
      return;
    }


    this.api.createLogin({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({

      next: (res: any) => {

        // 🔥 FORCE UI UPDATE FIRST
        this.setMessage(res?.message || "User created successfully", true);
        this.createSuccess = true;
        this.clearForm();
        this.loadUsers();

        this.cd.detectChanges(); // 🔥 IMPORTANT FIX

      },

      error: (err) => {
        this.setMessage(err?.error?.message || "Error creating user", false);
        this.cd.detectChanges();
      }

    });
  }

  // 🔥 DELETE FIXED
  deleteUser(id: number, email: string) {

    // 🔒 PREVENT DELETE FOR THIS EMAIL
    if (email === 'destination56662025@gmail.com') {
      this.deleteMessage = "This user cannot be deleted";
      this.deleteSuccess = false;
      return;
    }

    this.api.deleteUser(id).subscribe({

      next: (res: any) => {

        // 🔥 REMOVE FROM UI
        this.users = this.users.filter(user => user.id !== id);

        // 🔥 SUCCESS MESSAGE
        this.deleteMessage = res?.message || "User deleted successfully";
        this.deleteSuccess = true;

      },

      error: (err) => {

        this.deleteMessage = err?.error?.message || "Delete failed";
        this.deleteSuccess = false;

      }

    });
  }

  // 🔥 SINGLE SOURCE OF TRUTH FOR UI MESSAGE
  setMessage(msg: string, success: boolean) {
    this.message = msg;
    this.isSuccess = success;
  }

  // CLEAR FORM
  clearForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.emailError = false;
  }
}