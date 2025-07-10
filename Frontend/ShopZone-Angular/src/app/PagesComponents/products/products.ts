import { Component, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Navbar } from '../../ReusableComponents/navbar/navbar';
import { Footer } from '../../ReusableComponents/footer/footer';
import { CommonModule, NgFor, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../data-service';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [RouterModule, Navbar, Footer, CommonModule, FormsModule, DecimalPipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit, OnDestroy { // Implemented OnDestroy

  products: any[] = [];
  filteredProductsList: any[] = [];
  searchText: string = '';
  selectedCategory: string = 'all';
  sortBy: string = 'relevance';

  message: string = '';
  messageType: 'success' | 'error' | 'info' | '' = '';
  private routerSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private dataService: DataService, private router: Router) {
    // Subscribe to router events to reload products when navigating to this page
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.urlAfterRedirects.startsWith('/products'))
    ).subscribe(() => {
      console.log('ProductsComponent: NavigationEnd event detected. Reloading products...');
      this.getAllProducts();
    });
  }

  ngOnInit(): void {
    console.log('ProductsComponent: ngOnInit called. Initial product load...');
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe(); // Unsubscribe to prevent memory leaks
  }

  getAllProducts(): void {
    console.log('ProductsComponent: Fetching all products...');
    this.dataService.getProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.applyFiltersAndSort(); // Apply filters/sort immediately after fetching
        console.log("ProductsComponent: Fetched all products successfully:", this.products);
        if (this.products.length === 0) {
          this.showMessage("No products available.", 'info');
        } else {
          this.clearMessage();
        }
      },
      error: (err) => {
        console.error("ProductsComponent: Error loading products:", err);
        this.showMessage("Failed to load products: " + (err.error?.message || "Server error. Please check backend."), 'error');
        this.products = [];
        this.filteredProductsList = [];
      }
    });
  }

  applyFiltersAndSort(): void {
    let tempProducts = [...this.products];

    if (this.selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(product => product.category && product.category.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    if (this.searchText) {
      tempProducts = tempProducts.filter((product: any) =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(this.searchText.toLowerCase()))
      );
    }

    switch (this.sortBy) {
      case 'priceAsc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        tempProducts.sort((a, b) => b.id - a.id);
        break;
      case 'relevance':
      default:
        break;
    }

    this.filteredProductsList = tempProducts;
    console.log('ProductsComponent: Applied filters and sort. Displaying:', this.filteredProductsList.length, 'products.');

    if (this.filteredProductsList.length === 0 && (this.searchText || this.selectedCategory !== 'all')) {
      this.showMessage("No products found matching your criteria.", 'info');
    } else if (this.products.length > 0 && this.messageType !== 'success') { // Only clear if not a persistent success message
      this.clearMessage();
    }
  }

  onSearchChange(): void {
    this.applyFiltersAndSort();
  }

  onCategoryChange(): void {
    this.applyFiltersAndSort();
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  addToCart(product: any): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = localStorage.getItem('userId');

    if (!isLoggedIn || !userId) {
      this.showMessage("Please login first to add items to cart.", 'error');
      this.router.navigate(['/login']);
      return;
    }

    const cartItemDTO = {
      userId: +userId,
      productId: product.id,
      quantity: 1
    };

    this.dataService.addToCart(cartItemDTO).subscribe({
      next: (response) => {
        this.showMessage(response, 'success');
      },
      error: (err) => {
        console.error("ProductsComponent: Error adding to cart:", err);
        this.showMessage("Failed to add to cart: " + (err.error?.message || "Server error."), 'error');
      }
    });
  }

  // Helper methods for messages
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

  // TrackBy function for *ngFor performance
  trackByProductId(index: number, product: any): number {
    return product.id;
  }
}