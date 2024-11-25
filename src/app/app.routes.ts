import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { LoginComponent } from './components/login/login.component';
import { Reactive } from '@angular/core/primitives/signals';
import { CreateOrderComponent } from './create-order/create-order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { AssignedOrdersComponent } from './assigned-orders/assigned-orders.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { AssignedOrdersCourierComponent } from './assigned-orders-courier/assigned-orders-courier.component';
import { UpdateOrderStatusComponent } from './update-order-status/update-order-status.component';
// import { AuthGuard } from './role.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'confirmation', component: OrderConfirmationComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo:'login', pathMatch:'full' },
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'order-details/:id', component: OrderDetailComponent },
  { path: 'assigned-orders', component: AssignedOrdersComponent} ,//, canActivate: [AuthGuard] },

  { path: 'manage-orders', component: ManageOrdersComponent},
  { path: 'assigned-orders-courier', component: AssignedOrdersCourierComponent},
  { path: 'update-order-status', component:UpdateOrderStatusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
