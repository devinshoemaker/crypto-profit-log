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
  selector: 'page-add-edit-transaction',
  templateUrl: 'add-edit-transaction.html',
})
export class AddEditTransactionPage {

  transactionForm: FormGroup;
  potentialProfit: number;

  transaction: Transaction = {
    purchaseAmountDollars: null,
    currentCryptoPrice: null,
    cryptoQuantity: null,
    breakEvenPrice: null,
    suggestedSellPrice: null,
    complete: false
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public transactionProvider: TransactionProvider) {
    this.transactionForm = formBuilder.group({
      currentCryptoPrice: ['', Validators.required],
      cryptoQuantity: ['', Validators.required]
    });

    if (this.navParams.get('transaction')) {
      this.transaction = this.navParams.get('transaction');
    }
  }

  ionViewDidLoad() {}

  /**
   * Calculate the transaction cost and suggested sale prices.
   */
  calculateSuggestedSalePrice() {
    if (this.transactionForm.valid) {
      this.transaction.cryptoQuantity = this.transactionForm.controls.cryptoQuantity.value;
      this.transaction.currentCryptoPrice = this.transactionForm.controls.currentCryptoPrice.value;
      this.transaction.purchaseAmountDollars = this.transaction.cryptoQuantity * this.transaction.currentCryptoPrice;

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
      this.potentialProfit = suggestedSellTotal - purchaseCostAfterFees;
    }
  }

  /**
   * Save the current transaction.
   */
  saveTransaction() {
    if (this.transactionForm.valid) {
      this.calculateSuggestedSalePrice();

      if (this.navParams.get('isUpdate')) {
        this.transactionProvider.updateTransaction(this.transaction);
      } else {
        this.transactionProvider.createTransaction(this.transaction);
      }

      this.navCtrl.pop();
    }
  }

}
