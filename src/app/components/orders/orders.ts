import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {

  orders: any[] = [];

  selectedItems: any[] = [];
  selectedUser: any = null;
  showItemsModal = false;
  showUserModal = false;
  delavaryPopup = false;
  selectedOrderId: string = '';

  // 🔥 Toast message
  message: string = '';
  showMsg: boolean = false;
  showPaymentPopup = false;
  selectedPaymentImage = '';
  private hasLoaded = false;
  selectedOrder: any;
  isPhonePe: boolean = false;

  constructor(private api: ApiService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadOrdersOnce();
  }

  OpenDelivery(order: any) {
    this.selectedOrderId = order?.orderId || '';
    this.delavaryPopup = true;
  }

  closeDeliveryPopup() {
    this.delavaryPopup = false;
  }

  confirmDelivery() {
    // ✅ Implement delivery confirmation logic here
    this.DeliveryOrder();
    this.closeDeliveryPopup();
  }
  openPaymentProof(order: any): void {

    this.selectedOrder = order;
    this.showPaymentPopup = true;

    const screenshot = order?.items?.[0]?.paymentScreenshot;

    // ✅ If screenshot exists → PhonePe
    if (screenshot) {
      this.selectedPaymentImage = screenshot;
      this.isPhonePe = true;
    }

    // ❌ If no screenshot → Google Pay
    else {
      this.selectedPaymentImage = '';
      this.isPhonePe = false;
    }
  }

  closePaymentPopup() {
    this.showPaymentPopup = false;
    this.selectedPaymentImage = '';
  }

  // ✅ Load Orders
  loadOrdersOnce(): void {
    if (this.hasLoaded) return;

    this.hasLoaded = true;

    this.api.getAdminOrders().subscribe({
      next: (res: any) => {

        if (typeof res === 'string') {
          this.orders = JSON.parse(res);
        } else if (Array.isArray(res)) {
          this.orders = res;
        } else if (res?.body) {
          this.orders = res.body;
        } else if (res?.data) {
          this.orders = res.data;
        } else {
          this.orders = [];
        }

        this.cd.detectChanges();
      },
      error: () => {
        this.orders = [];
      }
    });
  }

  // 🔥 Open Items
  openItems(order: any): void {
    this.selectedItems = order?.items || [];
    this.showItemsModal = true;
  }

  closeItems(): void {
    this.showItemsModal = false;
  }

  // 🔥 Open User
  openUser(order: any): void {
    this.selectedUser = order?.userDetails || null;
    this.showUserModal = true;
  }

  closeUser(): void {
    this.showUserModal = false;
  }

  // 🔥 DELETE (FAST UI UPDATE)
  deleteOrder(orderId: string): void {
    if (!orderId) return;

    this.api.deleteOrder(orderId).subscribe({
      next: (res: any) => {

        // ✅ Show message
        this.showMessage(res?.message || 'Deleted successfully');

        // ✅ Fast UI update
        this.orders = this.orders.filter(o => o.orderId !== orderId);

        // ✅ Optional: full page reload (if you REALLY want)
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      },
      error: () => {
        this.showMessage('Delete failed!');
      }
    });
  }

  // 🔥 Toast Message (5 sec)
  showMessage(msg: string): void {
    this.message = msg;
    this.showMsg = true;

    setTimeout(() => {
      this.showMsg = false;
    }, 5000);
  }

  // 🔥 Subtotal
  getSubtotal(): number {
    return this.selectedItems.reduce(
      (sum, item) => sum + (item?.totalPrice || 0),
      0
    );
  }


  // 🔥 Confirm Delivery
  DeliveryOrder(): void {

    if (!this.selectedOrderId) return;
    const selectedOrder = this.orders.find(
      o => o.orderId === this.selectedOrderId
    );
    const revenue = selectedOrder?.totalPrice || 0;

    this.api.deliverOrder(this.selectedOrderId, revenue).subscribe({

      next: (res: any) => {

        // ✅ update status instantly
        const index = this.orders.findIndex(
          o => o.orderId === this.selectedOrderId
        );

        if (index !== -1) {

          this.orders[index].status = 'DELIVERED';

          this.orders = [...this.orders];
        }

        // ✅ close popup
        this.delavaryPopup = false;

        // ✅ success message
        this.showMessage(
          res?.message || 'Order marked as delivered!'
        );

        // ✅ refresh UI
        this.cd.detectChanges();

      },

      error: () => {

        this.showMessage('Failed to mark as delivered!');

      }

    });
  }
}