import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  transactions: Transaction[];

  constructor(public navCtrl: NavController, public transactionService: TransactionProvider) {

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
  getTransactions() {
    this.transactionService.getAllTransactions().then((data) => {
      this.transactions = data;
    });
  }

  /**
   * Navigate to a view to create a new transaction.
   */
  newTransaction() {
    this.navCtrl.push(AddEditTransactionPage);
  }

  /**
   * Navigate to a view to edit an existing transaction.
   *
   * @param transaction Existing transaction to be edited.
   */
  viewTransaction(transaction) {
    this.navCtrl.push(AddEditTransactionPage, { transaction: transaction, isUpdate: true });
  }

  /**
   * Mark an existing transaction as "complete".
   *
   * @param transaction
   */
  archiveTransaction(transaction) {
    transaction.complete = !transaction.complete;
    this.transactionService.updateTransaction(transaction);
  }

}
