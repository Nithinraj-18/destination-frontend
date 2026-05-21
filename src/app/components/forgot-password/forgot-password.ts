import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {

  email = '';

  constructor(private api: ApiService) {}

  submit() {
    this.api.forgotPassword({ email: this.email }).subscribe(() => {
      alert('Reset link sent to email');
    });
  }
}