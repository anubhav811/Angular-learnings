import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {}

  addToCart(cartItem: CartItem) {
    // check if we already have the item in our cart
    let existingCartItem = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === cartItem.id
      );
    }

    if (existingCartItem != undefined) {
      // increment the quantity
      existingCartItem!.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(cartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentItem of this.cartItems) {
      totalPriceValue += currentItem.quantity * currentItem.unitPrice;
      totalQuantityValue += currentItem.quantity;
    }

    // publish the new values .. all subscribers will recieve the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //
    this.logCartValues(totalPriceValue, totalQuantityValue);
  }
  logCartValues(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let cartItem of this.cartItems) {
      const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(
        `name= ${cartItem.name} , quantity=${cartItem.quantity} , unitPrice=${subTotalPrice}`
      );
    }
    console.log(
      `totalPrice : ${totalPriceValue.toFixed(
        2
      )} , totalQuantity: ${totalQuantityValue}`
    );
  }
  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity === 0){
      this.remove(cartItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
   
    const itemIndex = this.cartItems.findIndex((item) => item.id === cartItem.id);


    // if found , remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
