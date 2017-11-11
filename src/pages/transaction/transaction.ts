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

  transaction: Transaction = {
    purchaseAmountDollars: null,
    currentCryptoPrice: null,
    cryptoQuantity: null,
    breakEvenPrice: null,
    suggestedSellPrice: null,
    active: true
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public transactionService: TransactionProvider) {
    this.transactionForm = formBuilder.group({
      purchaseAmountDollars: [''],
      currentCryptoPrice: ['', Validators.required],
      cryptoQuantity: ['', Validators.required],
      breakEvenPrice: [''],
      suggestedSellPrice: ['']
    });

    if (this.navParams.get('transaction')) {
      this.transaction = this.navParams.get('transaction');
    }
  }

  ionViewDidLoad() {
  }


  calculateSuggestedSalePrice() {
    if (this.transactionForm.valid) {
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
  }

  saveTransaction(transaction) {
    if (this.transactionForm.valid) {
      this.calculateSuggestedSalePrice();

      if (this.navParams.get('isUpdate')) {
        this.transactionService.updateTransaction(transaction);
      } else {
        this.transactionService.createTransaction(transaction);
      }

      this.navCtrl.pop();
    }
  }

}
