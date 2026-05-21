import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {

  private cart: any[] = [];

  addToCart(product: any) {

    let existing = this.cart.find(p => p.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      product.quantity = 1; // 🔥 FIX
      this.cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getCart(): any[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  removeFromCart(id: string) {
    this.cart = this.getCart().filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem('cart');
  }
}