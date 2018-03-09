import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertController, IonicPage, NavController, NavParams, Select } from 'ionic-angular';

import { CryptocurrencyProvider } from '../../providers/cryptocurrency/cryptocurrency';
import { ExchangeProvider } from '../../providers/exchange/exchange';
import { TransactionCalculatorProvider } from '../../providers/transaction-calculator/transaction-calculator';
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
      this.transactionForm.controls.cost.patchValue(TransactionCalculatorProvider.calculateCost(this.transactionForm.controls.quantity.value, this.transactionForm.controls.price.value, exchange.transactionFeePercentage));
      this.transactionForm.controls.breakEvenPrice.patchValue(TransactionCalculatorProvider.calculateBreakEvenPrice(this.transactionForm.controls.price.value, exchange.transactionFeePercentage));
      this.transactionForm.controls.suggestedSellPrice.patchValue(TransactionCalculatorProvider.calculateSuggestedSellPrice(this.transactionForm.controls.breakEvenPrice.value));
    }
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
