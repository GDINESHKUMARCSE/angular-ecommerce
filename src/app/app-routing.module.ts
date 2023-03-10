import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchComponent } from './components/search/search.component';
import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG
} from '@okta/okta-angular';

import {OktaAuth} from '@okta/okta-auth-js';

//import myAppConfig from './config/my-app-config';
import { LoginComponent } from './components/login/login.component';

//const oktaConfig =  myAppConfig.oidc;
//const oktaAuth = new OktaAuth(oktaConfig);

const routes: Routes = [
 
  {path: 'category/:id', component: ProductListComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent},
{path: 'product/:id', component: ProductDetailsComponent},
{path: 'category', component: ProductListComponent},
{path: 'products', component: ProductListComponent},
{path: 'search/:keyword', component: ProductListComponent},
{path: 'login/callback', component: OktaCallbackComponent},
{path: 'login', component: LoginComponent},
{path: '', redirectTo: '/products', pathMatch: 'full'},
{path: '**', redirectTo: '/products', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
