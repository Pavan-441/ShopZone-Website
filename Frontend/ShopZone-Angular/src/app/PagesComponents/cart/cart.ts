// import { Component, OnInit } from '@angular/core';
// import { NavigationEnd, Router, RouterModule } from '@angular/router';
// import { Navbar } from '../../ReusableComponents/navbar/navbar';
// import { Footer } from '../../ReusableComponents/footer/footer';
// import { CommonModule } from '@angular/common';
// import { DataService } from '../../data-service';
// import { HttpClient } from '@angular/common/http';
// import { filter } from 'rxjs';

// @Component({
//   standalone: true,
//   selector: 'app-cart',
//   imports: [RouterModule, Navbar, Footer, CommonModule],
//   templateUrl: './cart.html',
//   styleUrl: './cart.css'
// })
// export class Cart implements OnInit {


//   cartItems: any[] = [];
//   totalPrice: number = 0;
//   userId: number | null = null;

//   constructor(private http: HttpClient, private service: DataService, private router: Router) {
//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd && event.urlAfterRedirects === '/cart')
//     ).subscribe(() => {
//       this.loadCartItems();
//     });
//   }
//    ngOnInit(): void {
//     this.loadCartItems();
//   }

//   loadCartItems(): void {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       this.userId = +storedUserId;
//       this.service.getCartItems(this.userId).subscribe({
//         next: (data: any[]) => {
//           this.cartItems = data;
//           this.calculateTotalPrice();
//         },
//         error: (err) => {
//           console.error("Error loading cart items:", err);
//           this.cartItems = []; 
//           this.totalPrice = 0;
//           alert("Failed to load cart items: " + (err.error?.message || "Please login or refresh."));
//         }
//       });
//     } else {
//       this.cartItems = [];
//       this.totalPrice = 0;
//       alert("Please log in to view your cart.");
//       this.router.navigate(['/login']); 
//     }
//   }

//   calculateTotalPrice(): void {
//     this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
//   }

//   increaseQuantity(item: any): void {
//     item.quantity++;
//     this.updateCartItem(item);
//   }

//   decreaseQuantity(item: any): void {
//     if (item.quantity > 1) {
//       item.quantity--;
//       this.updateCartItem(item);
//     } else {
//       this.removeItem(item.id);
//     }
//   }

//   updateCartItem(item: any): void {
//     const updatedCartItem = {
//       id: item.id, 
//       cart: { id: item.cart.id }, 
//       products: { id: item.products.id },
//       quantity: item.quantity
//     };
//     this.http.put(`http://localhost:8080/cartitem/${item.id}`, updatedCartItem, { responseType: 'text' }).subscribe({
//       next: (response) => {
//         console.log(response); 
//         this.calculateTotalPrice();
//       },
//       error: (err) => {
//         console.error("Error updating cart item quantity:", err);
//         alert("Failed to update quantity: " + (err.error?.message || "Please try again."));
//         this.loadCartItems(); 
//       }
//     });
//   }

//   removeItem(cartItemId: number): void {
//     if (confirm("Are you sure you want to remove this item from your cart?")) {
//       this.service.deleteCartItem(cartItemId).subscribe({
//         next: (response) => {
//           alert(response); 
//           this.loadCartItems();
//         },
//         error: (err) => {
//           console.error("Error removing item:", err);
//           alert("Failed to remove item: " + (err.error?.message || "Please try again."));
//         }
//       });
//     }
//   }

//   checkout(): void {
//     alert("Proceeding to checkout! Loading...");
//   }
// }




import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common'; // Added DecimalPipe
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../../ReusableComponents/navbar/navbar';
import { Footer } from '../../ReusableComponents/footer/footer';
import { DataService } from '../../data-service';  // Corrected import path
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, Navbar, Footer, DecimalPipe], // Added DecimalPipe
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  message: string = '';
  messageType: 'success' | 'error' | 'info' | '' = '';
  private cartSubscription: Subscription | undefined;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    console.log('CartComponent: ngOnInit called. Loading cart items...');
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  loadCartItems(): void {
    const userId = localStorage.getItem('userId');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn || !userId) {
      this.showMessage('Please login to view your cart.', 'info');
      console.warn('CartComponent: User not logged in or userId not found. Redirecting to login.');
      this.router.navigate(['/login']);
      this.cartItems = [];
      this.totalPrice = 0;
      return;
    }

    this.dataService.getCartItems(+userId).subscribe({
      next: (data: any[]) => {
        this.cartItems = data;
        this.calculateTotalPrice();
        console.log('CartComponent: Fetched cart items successfully:', this.cartItems);
        if (this.cartItems.length === 0) {
          this.showMessage('Your cart is empty.', 'info');
        } else {
          this.clearMessage();
        }
      },
      error: (err) => {
        console.error('CartComponent: Error loading cart items:', err);
        this.showMessage('Failed to load cart items: ' + (err.error?.message || 'Server error. Please check backend.'), 'error');
        this.cartItems = [];
        this.totalPrice = 0;
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  }

  increaseQuantity(item: any): void {
    item.quantity++;
    this.updateCartItem(item);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItem(item);
    } else {
      this.removeItem(item.id);
    }
  }

  updateCartItem(item: any): void {
    const updatedCartItem = {
      quantity: item.quantity,
    };
    this.dataService.updateCartItemQuantity(item.id, updatedCartItem).subscribe({
      next: (response) => {
        console.log('CartComponent: Cart item updated:', response);
        this.calculateTotalPrice(); 
        this.showMessage('Cart item quantity updated.', 'success');
      },
      error: (err) => {
        console.error('CartComponent: Error updating cart item:', err);
        this.showMessage('Failed to update item: ' + (err.error?.message || 'Server error.'), 'error');
      }
    });
  }

  removeItem(cartItemId: number): void {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      this.dataService.deleteCartItem(cartItemId).subscribe({
        next: (response) => {
          console.log('CartComponent: Item removed:', response);
          this.showMessage('Item removed from cart.', 'success');
          this.loadCartItems();
        },
        error: (err) => {
          console.error('CartComponent: Error removing item:', err);
          this.showMessage('Failed to remove item: ' + (err.error?.message || 'Server error.'), 'error');
        }
      });
    }
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.showMessage("Your cart is empty. Please add items before checking out.", 'info');
      return;
    }
    // this.showMessage('Proceeding to checkout!', 'success');
    this.showMessage('Ordered Successfully', 'success');
    alert("Order has been placed successfully.");
    console.log('Checkout initiated. Total:', this.totalPrice);
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