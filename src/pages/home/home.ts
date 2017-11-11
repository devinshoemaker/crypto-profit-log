import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TransactionPage } from "../transaction/transaction";
import { TransactionProvider } from '../../providers/transaction/transaction';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  transactions: Transaction[];

  constructor(public navCtrl: NavController, public transactionService: TransactionProvider) {

  }

  ionViewDidLoad() {
    this.getTransactions();
  }

  getTransactions() {
    this.transactionService.getAllTransactions().then((data) => {
      this.transactions = data;
    });
  }

  newTransaction() {
    this.navCtrl.push(TransactionPage);
  }

  viewTransaction(transaction) {
    this.navCtrl.push(TransactionPage, { transaction: transaction, isUpdate: true });
  }

  archiveTransaction(transaction) {
    transaction.active = false;
    this.transactionService.updateTransaction(transaction);
  }

}
