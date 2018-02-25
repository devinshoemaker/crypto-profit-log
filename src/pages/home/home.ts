import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { AddEditTransactionPage } from '../add-edit-transaction/add-edit-transaction';
import moment from 'moment';

/**
 * The home page that displays the users list of transactions.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public transactions: Transaction[];

  constructor(public navCtrl: NavController, public transactionProvider: TransactionProvider, private alertCtrl: AlertController) {
    this.getTransactions();
    // this.transactions = [{
    //   _id: "6792ef09-cbdc-4058-af39-2cb355019475",
    //   _rev: "1-c33c6d00a1604ba3806e2bdd9405430a",
    //   date: new Date(),
    //   exchange: "Binance",
    //   cryptocurrency: "BTC",
    //   price: 9500,
    //   quantity: 0.1,
    //   cost: 951.9,
    //   breakEvenPrice: 9519,
    //   suggestedSellPrice: 10470.900000000001,
    //   complete: false
    // }];
  }

  /**
   * Fetch transactions when this view has loaded.
   */
  ionViewDidLoad() {

  }

  /**
   * Get all transactions from the transaction provider.
   */
  private getTransactions() {
    this.transactionProvider.getAllTransactions().then((data) => {
      this.transactions = data;
    });
  }

  /**
   * Navigate to a view to create a new transaction.
   */
  public newTransaction() {
    this.navCtrl.push(AddEditTransactionPage);
  }

  /**
   * Navigate to a view to edit an existing transaction.
   *
   * @param transaction Existing transaction to be edited.
   */
  public viewTransaction(transaction) {
    this.navCtrl.push(AddEditTransactionPage, { transaction: transaction, isUpdate: true });
  }

  /**
   * Mark an existing transaction as "complete".
   *
   * @param transaction
   */
  public archiveTransaction(transaction) {
    transaction.complete = !transaction.complete;
    this.transactionProvider.updateTransaction(transaction);
  }

  /**
   * Display an alert and delete a transaction if the user confirms.
   *
   * @param transaction Existing transaction to be deleted.
   */
  public deleteTransaction(transaction) {
    let alert = this.alertCtrl.create({
      message: 'Delete this transaction?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.transactionProvider.deleteTransaction(transaction);
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Format a JavaScript date to "MM-DD-YYY".
   *
   * @param {Date} date JavaScript Date to be formatted.
   * @returns {string} "MM-DD-YYYY" date string.
   */
  public formatDate(date: Date) {
    return moment.utc(date).format('MM/DD/YYYY');
  }

}
