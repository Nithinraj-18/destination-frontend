import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink} from '@angular/router';
import { ApiService } from '../../services/api';
import { LoginPopup } from '../login-popup/login-popup';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginPopup, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  showLogin = false;

  // 🔥 hide/show navbar
  showNavbar = true;
  isMenuOpen = false;

  // 🔥 toast
  message = '';
  isError = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private cartService: CartService
  ) {

    // 🔥 listen to route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        // ❌ hide navbar for dashboard pages
        this.showNavbar = !event.url.includes('/dashboard');
      }
    });
  }

  // ---------------- LOGIN ----------------

  openLogin() {
    this.showLogin = true;
  }

  closeLogin() {
    this.showLogin = false;
  }

  // 🔥 HANDLE LOGIN RESULT
  handleLoginResult(res: any) {

    // close popup always
    this.showLogin = false;

    if (res?.status === 'error') {
      this.message = res.message;
      this.isError = true;

      setTimeout(() => {
        this.message = '';
      }, 2000);

      return;
    }

    // ✅ success
    localStorage.setItem('user', JSON.stringify(res));

    this.message = "Login successful";
    this.isError = false;

    setTimeout(() => {
      this.message = '';
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  handleForgotResult(res: any) {

    // 🔥 close popup
    this.showLogin = false;

    // show message
    this.message = res.message;
    this.isError = res.status === 'error';

    // go to home
    this.router.navigate(['/home']);

    // auto hide
    setTimeout(() => {
      this.message = '';
    }, 2000);
  }





  products: any[] = [];

  
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.api.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert('Added to cart');
  }
}