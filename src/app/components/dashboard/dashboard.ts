import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {

  menuOpen = true;
  isAdmin = false;

  // 🔥 logout popup
  showLogoutPopup = false;
  message = '';
  isCreateLoginAllowed = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private locationStrategy: LocationStrategy,
    private route: ActivatedRoute
  ) {
    // 🔥 prevent browser back
    history.pushState(null, '', location.href);

    this.locationStrategy.onPopState(() => {

      history.pushState(null, '', location.href);

    });
  }

  ngOnInit() {
    this.isAdmin = this.auth.isAdmin();
    this.isCreateLoginAllowed = this.auth.isCreateLoginAllowed();

    if (this.menuOpen) {
      document.body.style.overflow = 'auto';
    }
  }
  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = 'auto';

  }

  toggleMenu() {

    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

  }


  // 🔥 OPEN LOGOUT POPUP
  openLogoutPopup() {
    this.showLogoutPopup = true;
  }

  // 🔥 CLOSE LOGOUT POPUP
  closeLogoutPopup() {
    this.showLogoutPopup = false;
  }

  // 🔥 YES CLICK
  confirmLogout() {
    this.showLogoutPopup = false;
    this.logout();
  }

  // 🔥 LOGOUT
  logout() {

    // clear auth data
    this.auth.logout?.();
    localStorage.clear();
    sessionStorage.clear();

    // navigate and remove history
    this.router.navigate(['/'], { replaceUrl: true });

  }

}