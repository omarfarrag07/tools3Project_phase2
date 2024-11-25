import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css'],
  imports: [
    CommonModule,
    HttpClientModule, // Add HttpClientModule here
  ],
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = false;

  private ordersApiUrl = 'http://localhost:5000/api/orders'; 

  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
  
    const token = localStorage.getItem('authToken'); // Replace with your token retrieval logic
    const headers = { Authorization: `Bearer ${token}` }; // Adjust the Authorization scheme based on your backend
  
    this.http.get<any[]>(this.ordersApiUrl, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching orders:', error);
          return of([]); // Return an empty array on error
        })
      )
      .subscribe((data) => {
        this.orders = data;
        this.loading = false;
      });
  }

  updateOrderStatus(orderId: string, status: string): void {
    const order = this.orders.find(o => o.order_id === orderId);  // Make sure the property name matches
    if (order) {
      const token = localStorage.getItem('authToken');
      
      // Check if the token exists
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }
  
      // Include the token in the headers
      const headers = { Authorization: `Bearer ${token}` };
  
      this.http.put(`${this.ordersApiUrl}/newStatus/${orderId}`, { status }, { headers })
        .pipe(
          catchError((error) => {
            console.error('Error updating order status:', error);
            return of(null);
          })
        )
        .subscribe(() => {
          order.status = status;  // Update the local order status
        });
    }
  }

  deleteOrder(orderId: string): void {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` }; // Add Authorization header
    
    this.http.delete(`${this.ordersApiUrl}/${orderId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error deleting order:', error);
          return of(null); // Return null on error to prevent the app from crashing
        })
      )
      .subscribe(() => {
        // Remove the deleted order from the local array
        this.orders = this.orders.filter(o => o.id !== orderId);
      });
  }

  navigateToAssignCourier() {
    this.router.navigateByUrl('assigned-orders-courier');  // Navigate to My Orders page
  }
  
}
