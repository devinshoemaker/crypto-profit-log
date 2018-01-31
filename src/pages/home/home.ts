import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { TransactionProvider } from '../../providers/transaction/transaction';
import { AddEditTransactionPage } from '../add-edit-transaction/add-edit-transaction';

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

  }

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

}
