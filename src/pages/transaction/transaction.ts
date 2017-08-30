import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionProvider } from '../../providers/transaction/transaction';

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

  transactionForm: FormGroup;
  profit: number;

  transaction: { purchaseAmountDollars: number, currentCryptoPrice: number, cryptoQuantity: number, breakEvenPrice: number, suggestedSellPrice: number } = {
    purchaseAmountDollars: null,
    currentCryptoPrice: null,
    cryptoQuantity: null,
    breakEvenPrice: null,
    suggestedSellPrice: null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public transactionService: TransactionProvider) {
    this.transactionForm = formBuilder.group({
      purchaseAmountDollars: ['', Validators.required],
      currentCryptoPrice: ['', Validators.required],
      cryptoQuantity: [''],
      breakEvenPrice: [''],
      suggestedSellPrice: ['']
    });
  }

  ionViewDidLoad() {
  }


  calculateSuggestedSalePrice() {
    if (this.transaction.cryptoQuantity && this.transaction.currentCryptoPrice) {
      this.transaction.purchaseAmountDollars = this.transaction.cryptoQuantity * this.transaction.currentCryptoPrice;
    }

    let percentageFee = this.transaction.purchaseAmountDollars * 0.0149;
    let flatFee = 2.99;
    let transactionFee = 0.0;

    if (percentageFee > flatFee) {
      transactionFee = percentageFee;
    } else {
      transactionFee = flatFee;
    }

    this.transaction.breakEvenPrice = (Number(this.transaction.purchaseAmountDollars) + (transactionFee * 2)) / this.transaction.cryptoQuantity;
    this.transaction.suggestedSellPrice = this.transaction.breakEvenPrice * 1.01;

    let purchaseCostAfterFees = Number(this.transaction.purchaseAmountDollars) + (transactionFee * 2);
    let suggestedSellTotal = this.transaction.suggestedSellPrice * this.transaction.cryptoQuantity;
    this.profit = suggestedSellTotal - purchaseCostAfterFees;
  }

  saveTransaction(transaction) {
    this.transactionService.createTransaction(transaction);

    this.navCtrl.pop();
  }

}
