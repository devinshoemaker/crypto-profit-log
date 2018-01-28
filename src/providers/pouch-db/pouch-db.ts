import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

/**
 * PouchDB document CRUD.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Injectable()
export class PouchDbProvider {

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
   * Retrieve all documents from PouchDB.
   *
   * @returns {Promise<any>} Promise to retrieve and store documents.
   */
  public getAllDocuments() {
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
   * Create and store a new document.
   *
   * @param document A new document to be saved.
   */
  public createDocument(document) {
    this.db.post(document);
  }

  /**
   * Update an existing document.
   *
   * @param document An updated document to be saved.
   */
  public updateDocument(document) {
    this.db.put(document).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Delete an existing document.
   *
   * @param document A document to be deleted.
   */
  public deleteDocument(document) {
    this.db.remove(document).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Update local list of documents if a change in the PouchDB instance is detected.
   *
   * @param change The modified document.
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
