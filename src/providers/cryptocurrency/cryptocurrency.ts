import { Injectable } from '@angular/core';

/**
 * Initialize and retrieve the list of available exchanges.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Injectable()
export class CryptocurrencyProvider {

  private cryptocurrencies: Cryptocurrency[];

  constructor() {
    this.initializeCryptocurrencies();
  }

  /**
   * Initialize the default cryptocurrencies.
   */
  private initializeCryptocurrencies() {
    this.cryptocurrencies = [];

    let bitcoin: Cryptocurrency = {
      name: 'Bitcoin',
      acronym: 'BTC'
    };
    this.cryptocurrencies.push(bitcoin);

    let bitcoinCash: Cryptocurrency = {
      name: 'Bitcoin Cash',
      acronym: 'BCH'
    };
    this.cryptocurrencies.push(bitcoinCash);

    let litecoin: Cryptocurrency = {
      name: 'Litecoin',
      acronym: 'LTC'
    };
    this.cryptocurrencies.push(litecoin);

    let ethereum: Cryptocurrency = {
      name: 'Ethereum',
      acronym: 'ETH'
    };
    this.cryptocurrencies.push(ethereum);
  }

  /**
   * Retrieve the available cryptocurrencies.
   */
  public getCryptocurrencies() {
    return this.cryptocurrencies;
  }

  /**
   *
   * @param cryptocurrencyAcronym The acronym of the desired cryptocurrency.
   */
  public getCryptocurrencyByAcronym(cryptocurrencyAcronym: string) {
    return this.cryptocurrencies.find(function(cryptocurrency) {
      return cryptocurrency.acronym === cryptocurrencyAcronym;
    });
  }

}
