import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { error } from 'console';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { EcomValidators } from 'src/app/vlidators/ecom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup;

  totalPrice: number =0;

  totalQuantity: number=0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[]=[];
  states: State[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];




constructor(private formBuilder: FormBuilder, private formService: FormService, private cartService: CartService, private checkoutService: CheckoutService, private router: Router){

}

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                       [Validators.required, 
                                        Validators.minLength(2),
                                         EcomValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, 
          Validators.minLength(2),
           EcomValidators.notOnlyWhiteSpace]),
        email:new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street:  new FormControl('',
                                    [Validators.required,Validators.minLength(2),EcomValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
        [Validators.required,Validators.minLength(2),EcomValidators.notOnlyWhiteSpace]),
        state: new FormControl('',
        [Validators.required]),
        country: new FormControl('',
        [Validators.required]),
        zipCode: new FormControl('',
        [Validators.required,Validators.minLength(6),EcomValidators.notOnlyWhiteSpace])
        
        
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
        [Validators.required,Validators.minLength(2),EcomValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
        [Validators.required,Validators.minLength(2),EcomValidators.notOnlyWhiteSpace]),
        state: new FormControl('',
        [Validators.required]),
        country: new FormControl('',
        [Validators.required]),
        zipCode:new FormControl('',
        [Validators.required,Validators.minLength(6),EcomValidators.notOnlyWhiteSpace])
        
        
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',
        [Validators.required]),
        nameOnCard: new FormControl('',
        [Validators.required,EcomValidators.notOnlyWhiteSpace]),
        cardNumber:new FormControl('',
        [Validators.pattern('[0-9]{16}'), Validators.required]),
        securityCode:new FormControl('',
        [Validators.pattern('[0-9]{3}'), Validators.required]),
        expirationMonth: [''],
        expirationYear: ['']
        
        
      })
    });
//populate credit card years and months

const startMonth: number = new Date().getMonth()+1;
console.log("startMonth: "+startMonth);

this.formService.getCreditCardMonths(startMonth).subscribe(
  data=>{
    console.log(" credit card months: "+JSON.stringify(data));
    this.creditCardMonths = data;
  }
);

this.formService.getCreditCardYears().subscribe(
 data=> {
  console.log("credit card years: "+JSON.stringify(data));
  this.creditCardYears =data;

  }
);
this.formService.getCountryData().subscribe(
  data=>{
    console.log("Retrived countries : "+JSON.stringify(data));
    this.countries = data;
  }
);
this.formService.getState().subscribe(
  (data:any)=>{
    console.log("Retrived States : "+JSON.stringify(data));
    this.states = data;
  }
);
}
  
get firstName(){
  return this.checkoutFormGroup.get('customer.firstName');
}
get lastName(){
  return this.checkoutFormGroup.get('customer.lastName');
}
get email(){
  return this.checkoutFormGroup.get('customer.email');
}
get shippingAddressStreet(){
  return this.checkoutFormGroup.get('shippingAddress.street');
}
get shippingAddressCity(){
  return this.checkoutFormGroup.get('shippingAddress.city');
}
get shippingAddressState(){
  return this.checkoutFormGroup.get('shippingAddress.state');
}
get shippingAddressZipcode(){
  return this.checkoutFormGroup.get('shippingAddress.zipCode');
}

get shippingAddressCountry(){
  return this.checkoutFormGroup.get('billingAddress.country');
}
get billingAddressStreet(){
  return this.checkoutFormGroup.get('billingAddress.street');
}
get billingAddressCity(){
  return this.checkoutFormGroup.get('billingAddress.city');
}
get billingAddressState(){
  return this.checkoutFormGroup.get('billingAddress.state');
}
get billingAddressZipcode(){
  return this.checkoutFormGroup.get('billingAddress.zipCode');
}

get billingAddressCountry(){
  return this.checkoutFormGroup.get('billingAddress.country');
}

get creditCardType(){
  return this.checkoutFormGroup.get('creditCard.cardType');
}
get creditCardNameOnCard(){
  return this.checkoutFormGroup.get('creditCard.nameOnCard');
}
get creditCardNumber(){
  return this.checkoutFormGroup.get('creditCard.cardNumber');
}
get creditCardSecurityCode(){
  return this.checkoutFormGroup.get('creditCard.securityCode');
}


copyShippingAddressToBillingAddresss(event:any){
if(event.target.checked){
  this.checkoutFormGroup.controls.billingAddress
  .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

  this.billingAddressStates = this.shippingAddressStates;
}
else{
  this.checkoutFormGroup.controls.billingAddress.reset();

  this.billingAddressStates =[];
}
}

onSubmit(){
  console.log("Handling the submit button");

  if(this.checkoutFormGroup.invalid){
    this.checkoutFormGroup.markAllAsTouched();
    return;
  }
  //console.log(this.checkoutFormGroup.get('customer')!.value);
  //console.log("email address: " +this.checkoutFormGroup.get('customer')!.value.email);
  //console.log("shippping address country: " +this.checkoutFormGroup.get('shippingAddress')!.value.country.name);

 
  //console.log("shippping address state: " +this.checkoutFormGroup.get('shippingAddress')!.value.state.name);

let order = new Order();
order.totalPrice = this.totalPrice;
order.totalQuantity = this.totalQuantity;

//console.log(order.totalPrice);
//console.log(order.totalQuantity);

const cartItems = this.cartService.cartItems;

let orderItems: OrderItem[] = cartItems.map((tempCartItem:any) => new OrderItem(tempCartItem));

let purchase = new Purchase();

purchase.customer = this.checkoutFormGroup.controls['customer'].value;


purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
const shippingState: State =  JSON.parse(JSON.stringify(purchase.shippingAddress.state));
const shippingCountry: Country =  JSON.parse(JSON.stringify(purchase.shippingAddress.country));
purchase.shippingAddress.state = shippingState.name;
purchase.shippingAddress.country = shippingCountry.name;

purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
const billingState: State =  JSON.parse(JSON.stringify(purchase.billingAddress.state));
const billingCountry: Country =  JSON.parse(JSON.stringify(purchase.billingAddress.country));
purchase.billingAddress.state = billingState.name;
purchase.billingAddress.country = billingCountry.name;

purchase.order = order;

purchase.orderItems = orderItems;

this.checkoutService.placeOrder(purchase).subscribe(
  {
    next: (response:any) =>{
      alert(`Your order has been received.\n order Tracking number: ${response.orderTrackingNumber}`);

      this.resetCart();
    },
    error: (err:any) =>{
      alert(`there was an error: ${err.message}`);
    // }
  }
}
);


}
resetCart() {
  this.cartService.cartItems = [];
  this.cartService.totalPrice.next(0);
  this.cartService.totalQuantity.next(0);
  this.checkoutFormGroup.reset();
  this.router.navigateByUrl("/products");
}
  
handleMonthsandYears(){
  const creditCardFormGroup= this.checkoutFormGroup.get('creditCard');
  const currentYear: number = new Date().getFullYear();

  const selectedYear: number = Number(creditCardFormGroup!.value.expirationYear);
  console.log("print selected Yeaer" ,selectedYear);
  let startMonth: number;
  if(currentYear === selectedYear){
    startMonth= new Date().getMonth() + 1;
  }
  else{
    startMonth = 1;
  }
  this.formService.getCreditCardMonths(startMonth).subscribe(
    data=>{
      console.log("Retrieved credit card months: " +JSON.stringify(data));
      this.creditCardMonths = data;
      
    }
  );
}

getStates(formGroupName: string){
let formGroup = this.checkoutFormGroup.get(formGroupName);



//let nameofform = formGroupName;
//console.log(this.checkoutFormGroup.get(formGroupName)?.value);

console.log(`{formGroupName} ${formGroup}`);
const countryCode = formGroup?.value.country.code;
const countryName =  formGroup?.value.country.name;
//const countryCode = "IN";
console.log(`${formGroupName} country code: ${countryCode}`);
console.log(`${formGroupName} country name: ${countryName}`);
this.formService.getStateData(countryCode).subscribe(
  (data:any) => {

    if(formGroupName === 'shippingAddress'){
      this.shippingAddressStates = data;
      
    }
    else{
      this.billingAddressStates = data;
    }
    formGroup?.get('state')?.setValue(data[0]);
  }
);
}



reviewCartDetails() {
  this.cartService.totalPrice.subscribe(
    totalPrice=>{
      this.totalPrice = totalPrice;
    }
  );
  this.cartService.totalQuantity.subscribe(
    totalQuantity=>{
      this.totalQuantity = totalQuantity;
    }
  );
}


}

