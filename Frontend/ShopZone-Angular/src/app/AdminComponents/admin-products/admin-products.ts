import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../data-service'; 
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-admin-products',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  isEditing: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | 'info' | '' = '';

  productForm: any = {
    id: null,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: ''
  };

  constructor(private http: HttpClient, private router: Router, private dataService: DataService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/admin-products')
    ).subscribe(() => {
      console.log('NavigationEnd event for /admin-products detected. Checking login and loading products...');
      this.checkAdminLoginAndLoadProducts();
    });
  }

  ngOnInit(): void {
    console.log('AdminProducts ngOnInit called. Checking login and loading products...');
    this.checkAdminLoginAndLoadProducts();
  }

  checkAdminLoginAndLoadProducts(): void {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    console.log('checkAdminLoginAndLoadProducts: isAdminLoggedIn from localStorage:', isAdminLoggedIn);

    if (isAdminLoggedIn !== 'true') {
      this.showMessage("Access Denied. Please log in as an admin.", 'error');
      // Only navigate if not already on the admin login page to avoid loop
      if (this.router.url !== '/admin') {
        this.router.navigate(['/admin']);
      }
      return;
    }
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('loadProducts method called.');
    this.dataService.getProducts().subscribe({
      next: (data: any[]) => {
        console.log("Fetched products successfully:", data);
        this.products = data;
        this.clearMessage();
        if (this.products.length === 0) {
          this.showMessage("No products found in the database.", 'info');
        }
      },
      error: (err) => {
        console.error("Error loading products:", err);
        this.showMessage("Failed to load products: " + (err.error?.message || "Server error. Please check backend."), 'error');
        this.products = [];
      }
    });
  }

  submitProductForm(): void {
    this.clearMessage();
    if (!this.productForm.name || !this.productForm.price || this.productForm.price <= 0) {
      this.showMessage("Product name and a valid price are required.", 'error');
      return;
    }

    if (this.isEditing) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct(): void {
    this.http.post('http://localhost:8080/products', this.productForm, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.showMessage(response, 'success');
        this.loadProducts();
        this.resetForm();
      },
      error: (err) => {
        console.error("Error adding product:", err);
        this.showMessage("Failed to add product: " + (err.error || "Server error."), 'error');
      }
    });
  }

  editProduct(product: any): void {
    this.selectedProduct = { ...product };
    this.productForm = { ...product };
    this.isEditing = true;
    this.clearMessage();
  }

  updateProduct(): void {
    this.http.put(`http://localhost:8080/products/${this.productForm.id}`, this.productForm, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.showMessage(response, 'success');
        this.loadProducts();
        this.resetForm();
      },
      error: (err) => {
        console.error("Error updating product:", err);
        this.showMessage("Failed to update product: " + (err.error || "Server error."), 'error');
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm("Are you sure you want to delete this product?")) {
      this.http.delete(`http://localhost:8080/products/${productId}`, { responseType: 'text' }).subscribe({
        next: (response) => {
          this.showMessage(response, 'success');
          this.loadProducts();
          this.resetForm();
        },
        error: (err) => {
          console.error("Error deleting product:", err);
          this.showMessage("Failed to delete product: " + (err.error || "Server error."), 'error');
        }
      });
    }
  }

  resetForm(): void {
    this.selectedProduct = null;
    this.isEditing = false;
    this.productForm = {
      id: null,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: ''
    };
    this.clearMessage();
  }

  logoutAdmin(): void {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    this.router.navigate(['/admin']);
    this.showMessage("Logged out successfully!", 'success');
  }

  showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }
}