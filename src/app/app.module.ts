import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TransactionPage } from '../pages/transaction/transaction';
import { AddEditTransactionPage } from '../pages/add-edit-transaction/add-edit-transaction';

import { TransactionProvider } from '../providers/transaction/transaction';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TransactionPage,
    AddEditTransactionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TransactionPage,
    AddEditTransactionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TransactionProvider
  ]
})
export class AppModule {}
