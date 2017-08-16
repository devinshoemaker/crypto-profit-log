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

  cryptoQuantity: number;
  currentCryptoPrice: number;
  suggestedSellPrice: number;
  purchaseAmountDollars: number;
  profit: number;
  breakEvenPrice: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }


  calculateSuggestedSalePrice() {
    if (this.purchaseAmountDollars && this.currentCryptoPrice) {
      this.cryptoQuantity = this.purchaseAmountDollars / this.currentCryptoPrice;
    }

    let percentageFee = this.purchaseAmountDollars * 0.0149;
    let flatFee = 2.99;
    let transactionFee = 0.0;

    if (percentageFee > flatFee) {
      transactionFee = percentageFee;
    } else {
      transactionFee = flatFee;
    }

    this.breakEvenPrice = (Number(this.purchaseAmountDollars) + (transactionFee * 2)) / this.cryptoQuantity;
    this.suggestedSellPrice = this.breakEvenPrice * 1.01;

    let purchaseCostAfterFees = Number(this.purchaseAmountDollars) + (transactionFee * 2);
    let suggestedSellTotal = this.suggestedSellPrice * this.cryptoQuantity;
    this.profit = suggestedSellTotal - purchaseCostAfterFees;
  }

}
