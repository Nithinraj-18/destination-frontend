import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 🔐 GET TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 👤 GET ROLE
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // ✅ CHECK LOGIN
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🔥 CHECK ADMIN
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN' || this.getRole() === 'USER';
  }

  isCreateLoginAllowed(): boolean {
    return this.getRole() === 'ADMIN';
  }

  // 🚪 LOGOUT
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}