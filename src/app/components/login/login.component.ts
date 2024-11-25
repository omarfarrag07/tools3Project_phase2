import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient and HttpClientModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule], // Import HttpClientModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj: Login;
  registerObj: Register;

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
    this.registerObj = new Register();
  }

  onLogin() {
    if (!this.loginObj.email || !this.loginObj.password) {
      alert('Please enter both email and password.');
      return;
    }
  
    this.http.post<LoginResponse>('http://localhost:5000/api/users/login', this.loginObj)
      .subscribe(
        (res) => {
          if (res.token) {
            // Store the auth token and role in localStorage
            localStorage.setItem('authToken', res.token);
            localStorage.setItem('userRole', res.role || 'user');
            localStorage.setItem('userId',res.id ||'');
            // Log the user ID to the console
            console.log('User ID:', res.id);
  
            // Redirect based on the user role
            this.redirectUserBasedOnRole(res.role);
            alert('Login successful');
          } else {
            alert('Login failed. Please check your credentials and try again.');
          }
        },
        (error) => {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials and try again.');
        }
      );
  }
  

  redirectUserBasedOnRole(role: string | undefined) {
    console.log('User role:', role);
    
    if (role === 'user') {
      this.router.navigateByUrl('create-order');  // Customer default page
    } else if (role === 'courier') {
      this.router.navigateByUrl('assigned-orders');  // Courier default page
    } else if (role === 'admin') {
      this.router.navigateByUrl('manage-orders');  // Admin default page
    } else {
      this.router.navigateByUrl('home');  // Default route for other roles
      console.log('Unknown role:', role);
    }
  }

  onRegister() {
    console.log(this.registerObj);
    this.http.post<RegisterResponse>('http://localhost:5000/api/users/register', this.registerObj)
      .subscribe(
        (res) => {
          if (res.id) {
            alert('Registration successful');
            this.router.navigateByUrl('login');
          } else if (res.error) {
            alert(res.error);  // Display error message from backend
          } else {
            alert('Unexpected response format');
          }
        },
        (error) => {
          console.error('Registration error', error);
          alert('There was a registration error');
        }
      );
  }
}

// Models
export class Login {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}

export class Register {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;

  constructor() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.phone = '';
    this.role = 'user';  // Default role as 'user'
  }
}

// Interfaces
interface LoginResponse {
  token?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  error?: string;
}

interface RegisterResponse {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  error?: string;
}
