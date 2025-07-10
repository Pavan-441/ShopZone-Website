import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = "http://localhost:8080"

  constructor(private http: HttpClient) { }

  getConnection() {
    return this.http.get(this.baseUrl, { responseType: 'text' });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl.concat("/users"));
  }

  getUserById(userId: number) {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl.concat("/products"));
  }

  addToCart(cartItem: any) {
    return this.http.post(`${this.baseUrl}/cartitems`, cartItem, { responseType: 'text' });
  }

  getCartItems(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cartitems/user/${userId}`);
  }

  // made update in this
  updateCartItemQuantity(cartItemId: number, updatedCartItem: any): Observable<string> {
    return this.http.put(`http://localhost:8080/cartitem/${cartItemId}`, updatedCartItem, {
      responseType: 'text'
    });
  }

  deleteCartItem(cartItemId: number): Observable<string> {
    return this.http.delete(`http://localhost:8080/cartitem/${cartItemId}`, { responseType: 'text' });
  }
  
}
