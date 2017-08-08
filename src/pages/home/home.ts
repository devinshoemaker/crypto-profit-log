import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TransactionPage } from "../transaction/transaction";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  newTransaction() {
    this.navCtrl.push(TransactionPage);
  }

}
