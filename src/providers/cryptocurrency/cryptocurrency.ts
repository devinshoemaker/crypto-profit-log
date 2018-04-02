import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

/**
 * Initialize and retrieve the list of available exchanges.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Injectable()
export class CryptocurrencyProvider {

  private data: Cryptocurrency[];
  private db: any;
  private readonly remote: any;

  constructor() {
    this.db = new PouchDB('crypto_profit_log-cryptocurrency');

    this.remote = 'http://127.0.0.1:5984/crypto_profit_log-cryptocurrency';

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);
  }

  /**
   * Get all cryptocurrencies from CouchDB.
   *
   * @returns {Promise<Cryptocurrency[]>} Promise to retrieve and store cryptocurrencies.
   */
  public getAllCryptocurrencies() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true
      }).then((result) => {
        this.data = [];

        result.rows.map((row) => {
          this.data.push(row.doc);
        });

        if (this.data.length === 0) {
          this.data = CryptocurrencyProvider.getDefaultCryptocurrencies();
          this.data.map((cryptocurrency: Cryptocurrency) => {
            this.createCryptocurrency(cryptocurrency);
          });
        }

        this.data.sort(CryptocurrencyProvider.sortCryptocurrencies);

        resolve(this.data);

        this.db.changes({live: true, since: 'now', include_docs:true}).on('change', (change) => {
          this.handleChange(change);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  /**
   * Update local list of cryptocurrencies if a change in the PouchDB instance is detected.
   *
   * @param change The modified cryptocurrency.
   */
  private handleChange(change) {
    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    // A document was deleted
    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    } else {
      // A document was updated or added
      if (changedDoc) {
        this.data[changedIndex] = change.doc;
      } else {
        this.data.push(change.doc);
      }
    }

    this.data.sort(CryptocurrencyProvider.sortCryptocurrencies);
  }

  /**
   * Sort cryptocurrencies alphabetically by their acronyms.
   *
   * @param cryptocurrency1 The first cryptocurrency to compare.
   * @param cryptocurrency2 The second cryptocurrency to compare.
   * @returns {number} How to sort the two cryptocurrencies.
   */
  private static sortCryptocurrencies(cryptocurrency1, cryptocurrency2) {
    if (cryptocurrency1.acronym > cryptocurrency2.acronym) {
      return 1;
    }

    if (cryptocurrency1.acronym < cryptocurrency2.acronym) {
      return -1;
    }

    return 0;
  }

  /**
   * Retrieve the default cryptocurrencies.
   */
  private static getDefaultCryptocurrencies() {
    let cryptocurrencies: Cryptocurrency[] = [];

    let bitcoin: Cryptocurrency = {
      _id: null,
      _rev: null,
      name: 'Bitcoin',
      acronym: 'BTC'
    };
    cryptocurrencies.push(bitcoin);

    let bitcoinCash: Cryptocurrency = {
      _id: null,
      _rev: null,
      name: 'Bitcoin Cash',
      acronym: 'BCH'
    };
    cryptocurrencies.push(bitcoinCash);

    let litecoin: Cryptocurrency = {
      _id: null,
      _rev: null,
      name: 'Litecoin',
      acronym: 'LTC'
    };
    cryptocurrencies.push(litecoin);

    let ethereum: Cryptocurrency = {
      _id: null,
      _rev: null,
      name: 'Ethereum',
      acronym: 'ETH'
    };
    cryptocurrencies.push(ethereum);

    return cryptocurrencies;
  }

  /**
   * Retrieve a cryptocurrency by its acronym.
   *
   * @param cryptocurrencyAcronym The acronym of the desired cryptocurrency.
   */
  public getCryptocurrencyByAcronym(cryptocurrencyAcronym: string) {
    return this.getAllCryptocurrencies().then((data: Cryptocurrency[]) => {
      return data.find((cryptocurrency) => {
        return cryptocurrency.acronym === cryptocurrencyAcronym;
      })
    });
  }

  /**
   * Create and store a new cryptocurrency.
   *
   * @param cryptocurrency A new cryptocurrency to be saved.
   */
  public createCryptocurrency(cryptocurrency: Cryptocurrency) {
    this.db.post(cryptocurrency);
  }

}
