import { Injectable } from '@angular/core';

/**
 * Initialize and retrieve the list of available exchanges.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Injectable()
export class ExchangeProvider {

  private exchanges: Exchange[];

  constructor() {
    this.initializeExchanges();
  }

  /**
   * Initialize the available exchanges.
   */
  initializeExchanges() {
    this.exchanges = [];

    let binanceExchange: Exchange = {
      name: 'Binance',
      transactionFeePercentage: 0.001
    };
    this.exchanges.push(binanceExchange);

    let gdaxExchange: Exchange = {
      name: 'GDAX',
      transactionFeePercentage: 0
    };
    this.exchanges.push(gdaxExchange);
  }

  /**
   * Retrieve the list of available exchanges.
   *
   * @returns {Exchange[]} A list of available exchanges.
   */
  getExchanges() {
    return this.exchanges;
  }

  /**
   * Retrieve an exchange and it's information by the exchanges name.
   *
   * @param exchangeName The name of the exchange.
   * @returns {Exchange | undefined} The desired exchange and it's information.
   */
  getExchangeByName(exchangeName) {
    return this.exchanges.find(function (exchange) {
      return exchange.name === exchangeName;
    });
  }

}
