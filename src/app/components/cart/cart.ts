import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];

  showOrderPopup = false;
  showConfirmPopup = false;
  showAboutPopup = false;
  showNotePopup = false;
  errorMessage: string = '';
  successMessage: string = '';
  isPlacingOrder = false;
  

  order: any = {
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    pincode: '',
    state: '',
    district: '',
    taluk: '',
  };

  constructor(
    private cartService: CartService,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadCart();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();

    this.cartItems.forEach(item => {
      if (!item.quantity || isNaN(item.quantity)) {
        item.quantity = 1;
      }
    });
  }

  removeItem(id: string) {
    this.cartService.removeFromCart(id);
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }

  increaseQty(item: any) {
    item.quantity = (item.quantity || 1) + 1;
    this.updateCart();
  }

  decreaseQty(item: any) {
    if ((item.quantity || 1) > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  getItemTotal(item: any): number {
    return (Number(item.price) || 0) * (Number(item.quantity) || 1);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  }

  openOrderPopup() {
    this.showOrderPopup = true;
    this.errorMessage = '';
  }

  closeOrderPopup() {
    this.showOrderPopup = false;
  }

  // ✅ VALIDATION FIXED
  confirmOrder() {
    if (
      !this.order.name?.trim() ||
      !this.order.email?.trim() ||
      !this.order.mobileNumber?.trim() ||
      !this.order.address?.trim() ||
      !this.order.pincode?.trim() ||
      !this.order.state?.trim() ||
      !this.order.district?.trim() ||
      !this.order.taluk?.trim()
    ) {
      this.errorMessage = "All fields are mandatory!";
      return;
    }

    this.errorMessage = '';
    this.showOrderPopup = false;
    this.showConfirmPopup = true;
  }

  // ✅ RESET FORM
  resetOrderForm() {
    this.order = {
      name: '',
      email: '',
      mobileNumber: '',
      address: '',
      pincode: '',
      state: '',
      district: '',
      taluk: ''
    };
  }

  placeOrder() {

    this.isPlacingOrder = true;

    const payload = {
      userDetails: this.order,
      items: this.cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      }))
    };

    this.apiService.createOrder(payload).subscribe({
      next: (res: any) => {

        // 🔥 1. SET SUCCESS MESSAGE FIRST
        this.successMessage = res?.message || "Order placed successfully!";

        // 🔥 2. CLEAR CART IMMEDIATELY
        this.cartService.clearCart();
        this.cartItems = [];

        // 🔥 3. RESET FORM
        this.resetOrderForm();

        // 🔥 4. CLOSE POPUPS AFTER SUCCESS
        this.showConfirmPopup = false;
        this.showOrderPopup = false;

        this.isPlacingOrder = false;

        // 🔥 5. FORCE UI UPDATE
        this.cdr.detectChanges();
      },

      error: () => {
        this.errorMessage = "Order failed. Try again!";
        this.isPlacingOrder = false;
        this.cdr.detectChanges();
      }
    });
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    // Allow only numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateMobile(event: any): void {
    event.target.value = event.target.value
      .replace(/\D/g, '') // remove non-digits
      .slice(0, 10);      // max 10 digits
  }

  validatePincode(event: any): void {
    event.target.value = event.target.value
      .replace(/\D/g, '') // remove non-digits
      .slice(0, 6);       // max 6 digits
  }

  allowOnlyText(event: any): void {
    event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, '');
  }
}