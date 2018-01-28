import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddEditTransactionPage } from '../pages/add-edit-transaction/add-edit-transaction';

import { CryptocurrencyProvider } from '../providers/cryptocurrency/cryptocurrency';
import { ExchangeProvider } from '../providers/exchange/exchange';
import { PouchDbProvider } from '../providers/pouch-db/pouch-db';
import { TransactionProvider } from '../providers/transaction/transaction';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
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
    AddEditTransactionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CryptocurrencyProvider,
    ExchangeProvider,
    PouchDbProvider,
    TransactionProvider
  ]
})
export class AppModule {}
