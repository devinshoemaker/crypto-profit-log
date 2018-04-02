import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TransactionProvider } from '../src/providers/transaction/transaction';

export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {

  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return ;
  }

}

export class DeepLinkerMock {

}

export class TransactionProviderMock extends TransactionProvider {
  // public getAllTransactions() {
  //   console.log("mock");
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve([{
  //         _id: "6792ef09-cbdc-4058-af39-2cb355019475",
  //         _rev: "1-c33c6d00a1604ba3806e2bdd9405430a",
  //         date: new Date(),
  //         exchange: "Binance",
  //         cryptocurrency: "BTC",
  //         price: 9500,
  //         quantity: 0.1,
  //         cost: 951.9,
  //         breakEvenPrice: 9519,
  //         suggestedSellPrice: 10470.900000000001,
  //         complete: false
  //       }]);
  //     }, 1000);
  //   });
  // }
}
