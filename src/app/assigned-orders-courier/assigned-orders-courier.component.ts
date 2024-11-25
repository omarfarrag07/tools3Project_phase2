import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http'; // Import HttpHeaders
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assigned-orders-courier',
  standalone: true,
  templateUrl: './assigned-orders-courier.component.html',
  styleUrls: ['./assigned-orders-courier.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class AssignedOrdersCourierComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = true;
  couriers: { id: string; name: string }[] = []; // Update type to an array of objects with id and name
  selectedCourier: string = '';
  private authToken: string = localStorage.getItem('authToken') || '';  // Get token from localStorage
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAssignedOrders();
    this.fetchCouriers();
  }

  // Helper function to get headers with Authorization token
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,  // Add the token in the headers
    });
  }

  // Fetch orders assigned to a specific courier
  fetchAssignedOrders(): void {
    this.http
      .get<any[]>('http://localhost:5000/api/orders', {  // Use the correct backend URL
        headers: this.getAuthHeaders(),  // Pass headers here
      })
      .subscribe(
        (data) => {
          this.orders = data;
          console.log('Fetched Orders:', this.orders); // Log the orders
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching orders:', error);
          this.loading = false;
        }
      );
  }
  
  
  // Fetch available couriers for selection (if required)
  fetchCouriers(): void {
    this.http
      .get<any[]>('http://localhost:5000/api/users/couriers', {
        headers: this.getAuthHeaders(),  // Add token in headers
      })
      .subscribe(
        (data) => {
          // Assuming the API returns users with id and name properties
          this.couriers = data.map(user => ({
            id: user.id,  // User ID
            name: user.name || `User ${user.id}`  // Fallback for name if not provided
          }));
        },
        (error) => {
          console.error('Error fetching couriers:', error);
        }
      );
  }

  reassignOrder(orderid: string, newCourier: string): void {
    const order = this.orders.find((o) => o.order_id === orderid); // Match on order_id
    if (order) {
      console.log('Reassigning Order:', orderid, newCourier);
  
      this.http
        .post(
          `http://localhost:5000/api/orders/assign`,
          {
            orderId: orderid, // Directly use the passed orderid
            courierId: newCourier,
          },
          {
            headers: this.getAuthHeaders(),
          }
        )
        .subscribe(
          (response) => {
            console.log('Order reassigned successfully:', response);
          },
          (error) => {
            console.error('Error reassigning order:', error);
            console.error('Backend response:', error.error);
          }
        );
    } else {
      console.error('Order not found for ID:', orderid);
    }
  }
  
  
  
}
