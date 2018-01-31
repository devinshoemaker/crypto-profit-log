import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';

/**
 * Transaction CRUD.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Injectable()
export class TransactionProvider {

  private DOCUMENT_TYPE = 'TRANSACTION';

  private data: any;
  private db: any;
  private remote: any;

  constructor() {
    this.db = new PouchDB('crypto_profit_log');

    this.remote = 'http://127.0.0.1:5984/crypto_profit_log';

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);
  }

  /**
   * Get all transactions from CouchDB.
   *
   * @returns {Promise<any>} Promise to retrieve and store transactions.
   */
  public getAllTransactions() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.db.allDocs({
        include_docs: true
      }).then((result) => {
        this.data = [];

        result.rows.map((row) => {
          if (row.documentType === this.DOCUMENT_TYPE) {
            this.data.push(row.doc);
          }
        });

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
   * Create and store a new transaction.
   *
   * @param transaction A new transaction to be saved.
   */
  public createTransaction(transaction: Transaction) {
    transaction.documentType = this.DOCUMENT_TYPE;
    this.db.post(transaction);
  }

  /**
   * Update an existing transaction.
   *
   * @param transaction An updated transaction to be saved.
   */
  public updateTransaction(transaction: Transaction) {
    transaction.documentType = this.DOCUMENT_TYPE;
    this.db.put(transaction).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Delete an existing transaction.
   *
   * @param transaction A transaction to be deleted.
   */
  public deleteTransaction(transaction: Transaction) {
    this.db.remove(transaction).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Update local list of transactions if a change in the PouchDB instance is detected.
   *
   * @param change The modified transaction.
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
  }

}
