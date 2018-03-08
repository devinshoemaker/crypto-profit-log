import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Select } from 'ionic-angular';
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

  @ViewChild('cryptocurrencySelect') cryptocurrencySelect: Select;

  public transactionForm: FormGroup;
  public availableExchanges: Exchange[];
  public availableCryptocurrencies: Cryptocurrency[];
  public today: string;

  private DEFAULT_EXCHANGE = 'Binance';
  private DEFAULT_CRYPTOCURRENCY = 'BTC';

  constructor(public alertCtrl: AlertController,
              public formBuilder: FormBuilder,
              public navCtrl: NavController,
              public navParams: NavParams,
              public cryptocurrencyProvider: CryptocurrencyProvider,
              public exchangeProvider: ExchangeProvider,
              public transactionProvider: TransactionProvider) {
    this.transactionForm = formBuilder.group({
      _id: [null],
      _rev: [null],
      date: [new Date().toISOString(), Validators.required],
      exchange: ['', Validators.required],
      cryptocurrency: ['', Validators.required],
      price: [null, Validators.required],
      quantity: [null, Validators.required],
      cost: [null],
      breakEvenPrice: [null],
      suggestedSellPrice: [null],
      complete: [false]
    });
  }

  ionViewDidLoad() {
    this.today = new Date().toISOString();
    this.availableExchanges = this.exchangeProvider.getExchanges();
    this.getAvailableCryptocurrencies();

    if (this.navParams.get('transaction')) {
      this.transactionForm.patchValue(this.navParams.get('transaction'));
    } else {
      this.transactionForm.controls.exchange.patchValue(this.exchangeProvider.getExchangeByName(this.DEFAULT_EXCHANGE).name);
      this.transactionForm.controls.cryptocurrency.patchValue(this.DEFAULT_CRYPTOCURRENCY);
    }
  }

  /**
   * Retrieve available cryptocurrencies.
   */
  public getAvailableCryptocurrencies() {
    this.cryptocurrencyProvider.getAllCryptocurrencies().then((data: Cryptocurrency[]) => {
      this.availableCryptocurrencies = data;
    });
  }

  /**
   * Add a custom cryptocurrency.
   */
  public addCustomCryptocurrency() {
    this.cryptocurrencySelect.close();
    let alert = this.alertCtrl.create({
      title: 'Add cryptocurrency',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name: Bitcoin',
          type: 'text'
        },
        {
          name: 'acronym',
          placeholder: 'Acronym: BTC',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.cryptocurrencySelect.open();
          }
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name && data.acronym) {
              this.cryptocurrencyProvider.createCryptocurrency(data);
              this.transactionForm.controls.cryptocurrency.patchValue(data.acronym);
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Calculate the transaction cost and suggested sale prices.
   */
  public calculate() {
    if (this.transactionForm.valid) {
      let exchange: Exchange = this.exchangeProvider.getExchangeByName(this.transactionForm.controls.exchange.value);
      this.transactionForm.controls.cost.patchValue(AddEditTransactionPage.calculateCost(this.transactionForm.controls.quantity.value, this.transactionForm.controls.price.value, exchange.transactionFeePercentage));
      this.transactionForm.controls.breakEvenPrice.patchValue(AddEditTransactionPage.calculateBreakEvenPrice(this.transactionForm.controls.price.value, exchange.transactionFeePercentage));
      this.transactionForm.controls.suggestedSellPrice.patchValue(AddEditTransactionPage.calculateSuggestedSellPrice(this.transactionForm.controls.breakEvenPrice.value));
    }
  }

  /**
   * Calculate the cost of the transaction in the currency the user is buying in.
   *
   * @param {number} quantity The quantity of the cryptocurrency.
   * @param {number} price The purchase price of the cryptocurrency.
   * @param {number} transactionFeePercentage The transaction fee percentage for the purchase.
   * @returns {number} The cost of the transaction.
   */
  private static calculateCost(quantity: number, price: number, transactionFeePercentage: number) {
    return (quantity * price) * (1 + (transactionFeePercentage * 2));
  }

  /**
   * Calculate the price that the crypto must be at for the user to break even.
   *
   * @param {number} price The purchase price of the cryptocurrency.
   * @param {number} transactionFeePercentage The transaction fee percentage for the purchase.
   * @returns {number} The break even price of the purchase.
   */
  private static calculateBreakEvenPrice(price: number, transactionFeePercentage: number) {
    return price * (1 + (transactionFeePercentage * 2));
  }

  /**
   * Calculate the recommended price of the crypto for the user to make a decent profit.
   *
   * @param {number} breakEvenPrice The break even price of the purchase.
   * @returns {number} The suggested sell price to make a profit.
   */
  private static calculateSuggestedSellPrice(breakEvenPrice: number) {
    return breakEvenPrice * 1.1;
  }

  /**
   * Save the current transaction.
   */
  public saveTransaction() {
    this.calculate();

    if (this.navParams.get('isUpdate')) {
      this.transactionProvider.updateTransaction(this.transactionForm.value);
    } else {
      this.transactionProvider.createTransaction(this.transactionForm.value);
    }

    this.navCtrl.pop();
  }

}
