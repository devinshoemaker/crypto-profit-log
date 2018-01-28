import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { PouchDbProvider } from '../pouch-db/pouch-db';

/**
 * Transaction CRUD.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Injectable()
export class TransactionProvider {

  private DOCUMENT_TYPE = 'TRANSACTION';

  constructor(private pouchDbProvider: PouchDbProvider) {}

  /**
   * Get all transactions from CouchDB.
   *
   * @returns {Promise<any>} Promise to retrieve and store transactions.
   */
  public getAllTransactions() {
    return this.pouchDbProvider.getAllDocuments().then((data) => {
      return data.filter((transaction) => {
        return transaction.documentType === this.DOCUMENT_TYPE;
      })
    });
  }

  /**
   * Create and store a new transaction.
   *
   * @param transaction A new transaction to be saved.
   */
  public createTransaction(transaction: Transaction) {
    transaction.documentType = this.DOCUMENT_TYPE;
    this.pouchDbProvider.createDocument(transaction)
  }

  /**
   * Update an existing transaction.
   *
   * @param transaction An updated transaction to be saved.
   */
  public updateTransaction(transaction: Transaction) {
    transaction.documentType = this.DOCUMENT_TYPE;
    this.pouchDbProvider.updateDocument(transaction);
  }

  /**
   * Delete an existing transaction.
   *
   * @param transaction A transaction to be deleted.
   */
  public deleteTransaction(transaction: Transaction) {
    this.pouchDbProvider.deleteDocument(transaction);
  }

}
