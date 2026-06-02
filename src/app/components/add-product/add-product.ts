import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProduct implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // 🔹 ADD FORM
  product = {
    name: '',
    description: '',
    price: '',
    imageUrl: '', // keep as is (no change)
    category: '',
    outOfStock: false
  };

  // 🔹 TABLE DATA
  products: any[] = [];

  // 🔹 MESSAGE
  message = '';
  isSuccess = false;

  deleteMessage = '';
  deleteSuccess = false;

  isUpdating = false;
  // 🔹 POPUP
  showPopup = false;

  editProduct = {
    id: '',
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    outOfStock: false
  };

  // ✅ CORRECT FILE VARIABLE
  selectedFile: File | null = null;
  updateFile: File | null = null;
  previewUrl: any;

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  // ================= LOAD =================
  loadProducts() {
    this.api.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res;
        this.cd.detectChanges();
      },
      error: () => {
        this.products = [];
        this.cd.detectChanges();
      }
    });
  }

  // ================= FILE SELECT =================
  onFileSelected(event: any) {

    this.selectedFile = event.target.files[0]; // ✅ FIX

    if (this.selectedFile) {
      // 🔥 INSTANT PREVIEW (no delay)
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  onUpdateFileSelected(event: any) {
    this.updateFile = event.target.files[0];
  }

  // ================= VALIDATION =================
  isFormValid() {
    return this.product.name?.trim() &&
      this.product.description?.trim() &&
      this.product.price &&
      this.product.category?.trim() &&
      !!this.selectedFile; // ✅ FIX
  }

  // ================= ADD =================
  submit() {

    if (!this.isFormValid()) {
      this.setMessage("All fields are required", false);
      return;
    }

    if (!this.selectedFile) {
      this.setMessage("Image required", false);
      return;
    }

    const formData = new FormData();

    const request = {
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      category: this.product.category
    };

    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' })
    );

    // ✅ FIX FIELD NAME
    formData.append('image', this.selectedFile);

    this.api.addProduct(formData).subscribe({

      next: (res: any) => {

        this.setMessage(res?.message || "Product added successfully", true);

        this.clearForm();
        this.loadProducts();
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';

        this.cd.detectChanges();
      },

      error: (err) => {

        this.setMessage(
          err?.error?.message || "Error adding product",
          false
        );

        this.cd.detectChanges();
      }

    });
  }

  // ================= DELETE =================
  deleteProduct(id: string) {

    this.api.deleteProduct(id).subscribe({

      next: (res: any) => {

        this.products = this.products.filter(p => p.id !== id);

        this.deleteMessage = res?.message || "Deleted successfully";
        this.deleteSuccess = true;

        this.cd.detectChanges();
      },

      error: (err) => {

        this.deleteMessage = err?.error?.message || "Delete failed";
        this.deleteSuccess = false;

        this.cd.detectChanges();
      }

    });
  }

  // ================= OPEN EDIT =================
  openEdit(p: any) {

    this.resetEditForm();

    this.editProduct = {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category,
      outOfStock: p.outOfStock
    };

    this.showPopup = true;
  }

  // ================= UPDATE =================
  updateProduct() {

    if (this.isUpdating) return;

    if (!this.editProduct.name ||
      !this.editProduct.description ||
      !this.editProduct.price ||
      !this.editProduct.category ||
      this.editProduct.outOfStock === null ||
      this.editProduct.outOfStock === undefined) {

      this.setMessage("All fields required", false);
      return;
    }

    this.isUpdating = true;

    const id = this.editProduct.id;

    // 🔥 CREATE FORMDATA (same as create)
    const formData = new FormData();

    // 🔥 FIX: same structure as backend expects
    const request = {
      name: this.editProduct.name,
      description: this.editProduct.description,
      price: this.editProduct.price,
      category: this.editProduct.category,
      outOfStock: this.editProduct.outOfStock
    };

    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' })
    );

    // 🔥 OPTIONAL IMAGE
    if (this.updateFile) {
      formData.append('image', this.updateFile);
    }

    this.closePopup();

    this.api.updateProduct(id, formData).subscribe({

      next: (res: any) => {

        this.isUpdating = false;

        this.setMessage(res?.message || "Updated successfully", true);

        this.loadProducts();
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
      },

      error: (err) => {

        this.isUpdating = false;

        this.setMessage(
          err?.error?.message || "Update failed",
          false
        );
      }

    });
  }

  // ================= COMMON =================
  setMessage(msg: string, success: boolean) {
    this.message = msg;
    this.isSuccess = success;

    this.cd.detectChanges();

    setTimeout(() => this.message = '', 3000);
  }

  clearForm() {
    this.product = {
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '', // keep as is
      outOfStock: false
    };

    this.selectedFile = null as any;
    this.previewUrl = null;

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

  resetEditForm() {
    this.editProduct = {
      id: '',
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      category: '',
      outOfStock: false
    };
  }

  closePopup() {
    this.showPopup = false;
    this.resetEditForm();
  }
}