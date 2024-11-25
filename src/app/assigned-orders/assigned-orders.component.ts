import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assigned-orders',
  standalone: true,
  templateUrl: './assigned-orders.component.html',
  styleUrls: ['./assigned-orders.component.css'],
  imports: [CommonModule],
})

export class AssignedOrdersComponent implements OnInit {
  assignedOrders: Order[] = [];
  loading: boolean = true;
  private authToken: string = localStorage.getItem('authToken') || '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const courierId = localStorage.getItem('userId');
    if (courierId) {
      this.fetchAssignedOrders(courierId);
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

  // Fetch assigned orders for the courier
  fetchAssignedOrders(courierId: string): void {
    this.loading = true;
    
    console.log('Retrieved courierId from localStorage:', courierId);

    this.http.get<Order[]>(`http://localhost:5000/api/courier/orders/${courierId}`, {
      headers: this.getAuthHeaders(),
    }).subscribe(
      (data) => {
        this.assignedOrders = data || [];
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching assigned orders:', error);
        alert('Error fetching assigned orders');
        this.loading = false;
      }
    );
  }

  UpdateOrders(){
    this.router.navigateByUrl('update-order-status');
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
