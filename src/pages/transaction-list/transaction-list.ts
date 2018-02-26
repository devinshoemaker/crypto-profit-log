import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddEditTransactionPage } from '../add-edit-transaction/add-edit-transaction';
import { TransactionProvider } from '../../providers/transaction/transaction';
import * as moment from 'moment';

/**
 * A page that displays the users list of transactions.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */

@IonicPage()
@Component({
  selector: 'page-transaction-list',
  templateUrl: 'transaction-list.html',
})
export class TransactionListPage {

  public transactions: Transaction[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public transactionProvider: TransactionProvider) {}

  /**
   * Fetch transactions when this view has loaded.
   */
  ionViewDidLoad() {
    this.getTransactions();
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
