import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { CryptoType } from '../../enums/crypto-type';
import { ExchangeProvider } from '../../providers/exchange/exchange';

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

  public transactionForm: FormGroup;
  public exchanges: Exchange[];

  public transaction: Transaction = {
    exchange: null,
    cryptoType: null,
    purchaseCost: null,
    cryptoPrice: null,
    cryptoQuantity: null,
    breakEvenPrice: null,
    suggestedSellPrice: null,
    complete: false
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
              private exchangeProvider: ExchangeProvider, public transactionProvider: TransactionProvider) {
    this.transactionForm = formBuilder.group({
      exchange: ['', Validators.required],
      cryptoType: ['', Validators.required],
      cryptoPrice: ['', Validators.required],
      cryptoQuantity: ['', Validators.required]
    });

    this.exchanges = exchangeProvider.getExchanges();

    if (this.navParams.get('transaction')) {
      this.transaction = this.navParams.get('transaction');
    } else {
      this.transaction.exchange = this.exchangeProvider.getExchangeByName('Binance').name;
      this.transaction.cryptoType = CryptoType.BTC;
    }
  }

  ionViewDidLoad() {}

  /**
   * Calculate the transaction cost and suggested sale prices.
   */
  public calculate() {
    if (this.transactionForm.valid) {
      this.transaction.purchaseCost = this.calculatePurchaseCost();
      this.transaction.breakEvenPrice = this.calculateBreakEvenPrice();
      this.transaction.suggestedSellPrice = this.calculateSuggestedSellPrice();
    }
  }

  /**
   * Calculate the cost of the transaction in the currency the user is buying in.
   *
   * @returns {number} The cost of the users purchase.
   */
  private calculatePurchaseCost() {
    return (this.transaction.cryptoQuantity * this.transaction.cryptoPrice) * (1 + (this.exchangeProvider.getExchangeByName(this.transaction.exchange).transactionFeePercentage * 2));
  }

  /**
   * Calculate the price that the crypto must be at for the user to break even.
   *
   * @returns {number} The break even price for the current transaction.
   */
  private calculateBreakEvenPrice() {
    return this.transaction.cryptoPrice * (1 + (this.exchangeProvider.getExchangeByName(this.transaction.exchange).transactionFeePercentage * 2));
  }

  /**
   * Calculate the recommended price of the crypto for the user to make a decent profit.
   *
   * @returns {number} The recommended sell price for the crypto.
   */
  private calculateSuggestedSellPrice() {
    return this.transaction.breakEvenPrice * 1.1;
  }

  /**
   * Save the current transaction.
   */
  public saveTransaction() {
    if (this.transactionForm.valid) {
      this.calculate();

      if (this.navParams.get('isUpdate')) {
        this.transactionProvider.updateTransaction(this.transaction);
      } else {
        this.transactionProvider.createTransaction(this.transaction);
      }

      this.navCtrl.pop();
    }
  }

}
