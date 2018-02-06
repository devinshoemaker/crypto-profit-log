import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Select } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { ExchangeProvider } from '../../providers/exchange/exchange';
import { CryptocurrencyProvider } from '../../providers/cryptocurrency/cryptocurrency';
import moment from 'moment';

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
      date: [moment()],
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
      this.transactionForm.controls.cost.patchValue(this.calculateCost());
      this.transactionForm.controls.breakEvenPrice.patchValue(this.calculateBreakEvenPrice());
      this.transactionForm.controls.suggestedSellPrice.patchValue(this.calculateSuggestedSellPrice());
    }
  }

  /**
   * Calculate the cost of the transaction in the currency the user is buying in.
   *
   * @returns {number} The cost of the users purchase.
   */
  private calculateCost() {
    return (this.transactionForm.controls.quantity.value * this.transactionForm.controls.price.value) * (1 + (this.exchangeProvider.getExchangeByName(this.transactionForm.controls.exchange.value).transactionFeePercentage * 2));
  }

  /**
   * Calculate the price that the crypto must be at for the user to break even.
   *
   * @returns {number} The break even price for the current transaction.
   */
  private calculateBreakEvenPrice() {
    return this.transactionForm.controls.price.value * (1 + (this.exchangeProvider.getExchangeByName(this.transactionForm.controls.exchange.value).transactionFeePercentage * 2));
  }

  /**
   * Calculate the recommended price of the crypto for the user to make a decent profit.
   *
   * @returns {number} The recommended sell price for the crypto.
   */
  private calculateSuggestedSellPrice() {
    return this.transactionForm.controls.breakEvenPrice.value * 1.1;
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
