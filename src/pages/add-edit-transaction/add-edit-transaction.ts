import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { ExchangeProvider } from '../../providers/exchange/exchange';
import { CryptocurrencyProvider } from '../../providers/cryptocurrency/cryptocurrency';

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
  public availableExchanges: Exchange[];
  public availableCryptocurrencies: Cryptocurrency[];

  private DEFAULT_EXCHANGE = 'Binance';
  private DEFAULT_CRYPTOCURRENCY = 'BTC';

  public transaction: Transaction = {
    documentType: null,
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
              private cryptocurrencyProvider: CryptocurrencyProvider, private exchangeProvider: ExchangeProvider,
              public transactionProvider: TransactionProvider) {
    this.transactionForm = formBuilder.group({
      exchange: ['', Validators.required],
      cryptoType: ['', Validators.required],
      cryptoPrice: ['', Validators.required],
      cryptoQuantity: ['', Validators.required]
    });

    this.availableExchanges = exchangeProvider.getExchanges();
    this.availableCryptocurrencies = cryptocurrencyProvider.getCryptocurrencies();

    if (this.navParams.get('transaction')) {
      this.transaction = this.navParams.get('transaction');
    } else {
      this.transaction.exchange = this.exchangeProvider.getExchangeByName(this.DEFAULT_EXCHANGE).name;
      this.transaction.cryptoType = this.cryptocurrencyProvider.getCryptocurrencyByAcronym(this.DEFAULT_CRYPTOCURRENCY).acronym;
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
