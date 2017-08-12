import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Create or edit a crypto currency transaction.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */

@IonicPage()
@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {

  quantity: number;
  purchasePrice: number;
  suggestedSellPrice: number;
  purchaseDollars: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionPage');
  }


  calculateSuggestedSalePrice() {
    if (this.purchaseDollars && this.purchasePrice) {
      this.quantity = this.purchaseDollars / this.purchasePrice;
    }

    let percentageFee = this.purchaseDollars * 0.0149;

    let purchaseFlatFee = 1.99;
    let purchaseFee = 0.0;
    if (percentageFee > percentageFee) {
      purchaseFee = percentageFee;
    } else {
      purchaseFee = purchaseFlatFee;
    }

    let sellersFlatFee = 1.99;
    let sellersFee = 0.0;
    if (percentageFee > sellersFlatFee) {
      sellersFee = percentageFee;
    } else {
      sellersFee = sellersFlatFee;
    }

    this.suggestedSellPrice = (Number(this.purchasePrice) + purchaseFee + sellersFee) * 1.02;
  }


}
