import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // local URLs

  // private adminUrl = 'http://localhost:8082/api/admin';
  // private productUrl = 'http://localhost:8082/api/products';
  // private orderUrl = 'http://localhost:8082/api/orders';
  // private adminOrderUrl = 'http://localhost:8082/api/admin/orders';




  // production URLs

  private adminUrl = 'https://destination-backend-hr7f.onrender.com/api/admin';
  private productUrl = 'https://destination-backend-hr7f.onrender.com/api/products';
  private orderUrl = 'https://destination-backend-hr7f.onrender.com/api/orders';
  private adminOrderUrl = 'https://destination-backend-hr7f.onrender.com/api/admin/orders';

  constructor(private http: HttpClient) { }

  // ---------------- LOGIN ----------------
  login(email: string, password: string) {
    return this.http.post(`${this.adminUrl}/login`, {
      email,
      password
    });
  }

  // ---------------- FORGOT PASSWORD ----------------
  forgotPassword(data: { email: string }) {
    return this.http.post(`${this.adminUrl}/forgot-password`, data);
  }

  // ---------------- UPDATE PASSWORD ----------------
  updatePassword(data: any) {
    return this.http.post(`${this.adminUrl}/update-password`, data);
  }

  // CREATE LOGIN
  createLogin(data: any) {
    return this.http.post(`${this.adminUrl}/create`, data);
  }

  // api.ts

  getUsers() {
    return this.http.get(`${this.adminUrl}/getAll`);
  }

  getMonthlyRevenues() {
    return this.http.get(`${this.adminOrderUrl}/getAllRevenue`);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.adminUrl}/delete?id=${id}`);
  }

  // GET ORDERS
  getOrders() {
    return this.http.get(`${this.adminUrl}/orders`);
  }


  // ================= PRODUCT APIs =================


  addProduct(data: any) {
    return this.http.post(`${this.productUrl}/create`, data);
  }

  getAllProducts() {
    return this.http.get(`${this.productUrl}/getAll`);
  }

  getProductById(id: string) {
    return this.http.get(`${this.productUrl}/findById?id=${id}`);
  }

  updateProduct(id: string, data: any) {
    return this.http.put(`${this.productUrl}/update?id=${id}`, data);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.productUrl}/delete?id=${id}`);
  }


  // ================= ORDER API =================
  createOrder(data: any) {
    return this.http.post(`${this.orderUrl}/create`, data);
  }

  // ================= ADMIN GET ORDER API =================

  getAdminOrders() {
    return this.http.get(`${this.adminOrderUrl}/getAllOrders`);
    responseType: 'json'
  }

  deleteMultipleOrders(orderIds: string[]) {
    return this.http.post(`${this.adminOrderUrl}/delete-orders`, orderIds);
  }

  deliverOrder(orderId: string, revenue: number) {
    return this.http.put(`${this.adminOrderUrl}/delivery-order?orderId=${orderId}&revenue=${revenue}`, {});
  }
  exportAllOrders() {
    return this.http.get(`${this.adminOrderUrl}/exportAll`, {
      responseType: 'blob'
    });
  }
}
