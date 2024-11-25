import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Define the expected structure of each order item
export interface Order {
  courier_id: number | null;
  created_at: string;
  delivery_time: string;
  dropoff_location: string;
  order_id: number;
  package_details: string;
  pickup_location: string;
  status: string;
  user_id: number;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];  // Use the Order interface to type-check each order

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Check if we're in a browser environment and if localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      const userId = localStorage.getItem('userId');
      const authToken = localStorage.getItem('authToken');
    
      if (userId && authToken) {
        this.getOrders(Number(userId), authToken).subscribe(
          (data) => {
            this.orders = data;
            console.log('Orders received:', this.orders);  // Log to check order structure
          },
          (error) => {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch orders. Please check your authentication.');
          }
        );
      } else {
        alert('User not logged in or token missing');
      }
    } else {
      console.error('localStorage is not available in this environment');
    }
  }

  // Method to get orders from the API
  getOrders(user_id: number, authToken: string): Observable<Order[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.get<Order[]>(`http://localhost:5000/api/orders/user/${user_id}`, { headers });
  }

  // Method to handle navigation to order details
  viewOrderDetails(id: number) {
    if (id !== undefined) {
      console.log('Viewing details for order:', id);  // Ensure the order ID is correct
      this.router.navigate(['/order-details', id]);  // Correctly navigate to the order details page with the ID
    } else {
      console.error('Order ID is undefined');
    }
  }
  
}