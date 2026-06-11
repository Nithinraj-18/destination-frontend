import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { CartService } from '../../services/cart';

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
  paymentScreenshot: File | null = null;


  order: any = {
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    pincode: '',
    state: '',
    district: '',
    taluk: '',
    paymentMode: '',
    paymentConfirmation: false
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
    this.router.navigate(['/home']);
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

  onImageUpload(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.paymentScreenshot = file;
    }
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
      !this.order.taluk?.trim() ||
      !this.order.paymentMode?.trim()
    ) {
      this.errorMessage = "All fields are mandatory!";
      return;
    }

    // Online payment validation
    if (this.order.paymentMode === 'ONLINE') {

      // Only PhonePe requires screenshot + confirmation
      if (this.order.paymentApp === 'PHONEPE') {

        if (!this.order.paymentConfirmation) {
          this.errorMessage = "Please confirm that payment is completed.";
          return;
        }

        if (!this.paymentScreenshot) {
          this.errorMessage = "Please upload payment screenshot.";
          return;
        }
      }

      // GPay / WhatsApp = NO mandatory validation
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
      taluk: '',
      paymentMode: '',
      paymentConfirmation: false
    };
  }

  placeOrder() {

    this.isPlacingOrder = true;
    const formData = new FormData();

    const payload = {
      userDetails: {
        name: this.order.name,
        email: this.order.email,
        mobileNumber: this.order.mobileNumber,
        address: this.order.address,
        pincode: this.order.pincode,
        state: this.order.state,
        district: this.order.district,
        taluk: this.order.taluk
      },

      items: this.cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
        paymentMode: this.order.paymentMode
      }))
    };

    // JSON data
    formData.append(
      "request",
      JSON.stringify(payload)
    );

    // Screenshot
    if (this.paymentScreenshot) {
      formData.append(
        "file",
        this.paymentScreenshot,
        this.paymentScreenshot.name
      );
    }

    this.apiService.createOrder(formData).subscribe({
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