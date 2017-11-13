import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEditTransactionPage } from './add-edit-transaction';

@NgModule({
  declarations: [
    AddEditTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddEditTransactionPage),
  ],
})
export class AddEditTransactionPageModule {}
