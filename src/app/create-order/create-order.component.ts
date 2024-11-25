import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router service

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  orderObj: Order;

  constructor(private http: HttpClient, private router: Router) {
    this.orderObj = new Order();
  }

  // Method to create order
  onCreateOrder() {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');  // Retrieve the token from localStorage
  
    if (userId && authToken) {
      this.orderObj.userId = Number(userId);
  
      // Format deliveryTime if it contains time (remove the time part)
      if (this.orderObj.deliveryTime) {
        // Strip the time and leave only the date part in 'YYYY-MM-DD' format
        this.orderObj.deliveryTime = this.orderObj.deliveryTime.split('T')[0];
      }
  
      // Set the Authorization header
      const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
  
      this.http.post('http://localhost:5000/api/orders', this.orderObj, { headers }).subscribe(
        (res: any) => {
          alert('Order created successfully');
        },
        error => {
          if (error.status === 400) {
            alert('Validation error: ' + error.error.error);
          } else if (error.status === 401) {
            alert('Unauthorized: Please log in again.');
          } else {
            console.error('Order creation error', error);
            alert('There was an error creating the order');
          }
        }
      );
    } else {
      alert('User not logged in or missing authentication token');
    }
  }

  navigateToMyOrders() {
    this.router.navigateByUrl('my-orders');  // Navigate to My Orders page
  }



}

export class Order {
  userId: number = 0; // Include userId to match backend requirement
  pickupLocation: string = '';
  dropoffLocation: string = '';
  packageDetails: string = '';
  deliveryTime: string = '';
}
