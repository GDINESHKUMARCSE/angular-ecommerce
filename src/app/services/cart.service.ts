import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  


  cartItems: CartItem[] =[];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  constructor() { }

  addToCart(cartItem: CartItem){

    let alreadyExistingInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length>0){
      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === cartItem.id){
          existingCartItem = tempCartItem;
          break;

        }
      }
      alreadyExistingInCart = (existingCartItem!=undefined);
    }
     if(alreadyExistingInCart){
existingCartItem.quantity++;

     }
     else{
       this.cartItems.push(cartItem)
     }
this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity *currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quanitity=${tempCartItem.quantity},unitPrice= ${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(1)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
  if (theCartItem.quantity === 0){
    this.remove(theCartItem);
  }
  else{
    this.computeCartTotals();
  }
  }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem=> tempCartItem.id == theCartItem.id);

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

}
