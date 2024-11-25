import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-order-status',
  standalone: true,
  templateUrl: './update-order-status.component.html',
  styleUrls: ['./update-order-status.component.css'],
  imports: [CommonModule,FormsModule],
})
export class UpdateOrderStatusComponent implements OnInit {
  orders: Order[] = [];
  statusOptions: string[] = ['Picked Up', 'In Transit', 'Delivered'];
  loading: boolean = true;
  private authToken: string = localStorage.getItem('authToken') || '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const courierId = localStorage.getItem('userId');
    if (courierId) {
      this.fetchOrders(courierId);
    } else {
      alert('Courier not logged in');
      this.router.navigate(['/login']);
    }
  }

  // Helper function to get headers with Authorization token
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });
  }

  // Fetch orders assigned to the courier
  fetchOrders(courierId: string): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('No authentication token found. Please log in.');
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
  
    this.http.get<any[]>(`http://localhost:5000/api/courier/orders/${courierId}`, { headers })
      .subscribe({
        next: (data) => {
          console.log('Fetched orders:', data); // Debugging log
          this.orders = data;
          this.loading = false; // Stop loading once data is fetched
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
          this.loading = false; // Stop loading on error
          if (error.status === 401) {
            alert('Unauthorized. Please log in again.');
            this.router.navigate(['/login']);
          }
        },
      });
  }
  
  

  // Update the status of a specific order
  updateStatus(orderId: number, newStatus: string): void {
    const order = this.orders.find(o => o.order_id === orderId);
    if (order) {
      this.http.put(`http://localhost:5000/api/courier/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: this.getAuthHeaders() }
      ).subscribe(
        () => {
          order.status = newStatus;
          alert('Order status updated successfully');
        },
        (error) => {
          console.error('Error updating status:', error);
          alert('Failed to update order status');
        }
      );
    }
  }
}

// Updated Order interface
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
