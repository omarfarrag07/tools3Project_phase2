import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http'; // Import HttpClientModule here
import { CommonModule } from '@angular/common';

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
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule],  // Add HttpClientModule to imports
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
  
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      console.log('Order ID:', orderId);
  
      if (orderId && authToken) {
        // Convert orderId to a number if it's valid
        const orderIdNumber = Number(orderId);
  
        if (isNaN(orderIdNumber)) {
          alert('Invalid Order ID');
          this.loading = false;
        } else {
          this.fetchOrderDetails(orderIdNumber, authToken);
        }
      } else {
        this.loading = false;
        alert('Order ID or token missing');
      }
    } else {
      // Handle SSR case (no localStorage available)
      alert('Client-side features are unavailable during SSR.');
      this.loading = false;
    }
  }
  

  fetchOrderDetails(orderId: number, authToken: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    console.log('Fetching details for order:', orderId);

    this.http.get<Order>(`http://localhost:5000/api/orders/${orderId}`, { headers }).subscribe(
      (data) => {
        this.order = data;
        this.loading = false;
        console.log('Order details received:', this.order);
      },
      (error) => {
        console.error("Error fetching order details:", error);
        alert('Error fetching order details');
        this.loading = false;
      }
    );
  }

  cancelOrder() {
    if (this.order && this.order.status === 'pending') {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('Token missing');
        return;
      }
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
      const body = { status: 'canceled' }; // Define the body to send
  
      console.log('Cancelling order:', this.order.order_id);
  
      this.http.put(`http://localhost:5000/api/orders/newStatus/${this.order.order_id}`, body, { headers }).subscribe(
        () => {
          alert('Order cancelled successfully!');
          this.order = null;
          console.log('Order cancelled');
        },
        (error) => {
          console.error("Error cancelling order:", error);
          alert('Error cancelling order');
        }
      );
    } else {
      alert('Order sadly cannot be cancelled.');
    }
  }
  
}
