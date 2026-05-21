import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  products: any[] = [];
  showPopup = false;
  selectedProduct: any = null;

  constructor(
    private api: ApiService,
    private cartService: CartService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  openPopup(product: any): void {
    this.selectedProduct = product;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedProduct = null;
  }
  loadProducts(): void {
    this.api.getAllProducts().subscribe({
      next: (res: any) => {

        console.log('🔥 API RESPONSE:', res);

        // ✅ FIX: Correct response mapping
        this.products = res?.data ?? res ?? [];

        console.log('🔥 FINAL PRODUCTS:', this.products);

        // ✅ FIX: Force UI update (important for your issue)
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('❌ API ERROR:', err);
      }
    });
  }

  message = '';
  showMessage = false;
  private toastTimer: any;

  addToCart(product: any, imgElement: HTMLElement): void {

    this.cartService.addToCart(product);
    this.animateToCart(imgElement);

    this.message = "Added to cart successfully!";
    this.showMessage = true;

    // 🔥 clear old timer
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    // 🔥 run inside Angular zone
    this.ngZone.run(() => {

      this.toastTimer = setTimeout(() => {
        this.showMessage = false;
        this.cd.detectChanges(); // 🔥 force UI update
      }, 2000);

    });
  }




  animateToCart(img: HTMLElement) {

    const cart = document.querySelector('.cart-btn');

    if (!cart || !img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const flyingImg = img.cloneNode(true) as HTMLElement;

    flyingImg.style.position = 'fixed';
    flyingImg.style.left = imgRect.left + 'px';
    flyingImg.style.top = imgRect.top + 'px';
    flyingImg.style.width = imgRect.width + 'px';
    flyingImg.style.height = imgRect.height + 'px';
    flyingImg.style.zIndex = '9999';
    flyingImg.style.transition = 'all 0.8s ease-in-out';
    flyingImg.style.borderRadius = '10px';
    flyingImg.style.pointerEvents = 'none';

    document.body.appendChild(flyingImg);

    setTimeout(() => {

      flyingImg.style.left = cartRect.left + 'px';
      flyingImg.style.top = cartRect.top + 'px';
      flyingImg.style.width = '30px';
      flyingImg.style.height = '30px';
      flyingImg.style.opacity = '0.5';

    }, 50);

    setTimeout(() => {
      flyingImg.remove();
    }, 900);
  }
}