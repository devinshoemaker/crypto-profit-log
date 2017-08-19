import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';

/**
 * Transaction CRUD.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Injectable()
export class TransactionProvider {

  data: any;
  db: any;
  remote: any;

  constructor(public http: Http) {
    this.db = new PouchDB('coinbase-profit');

    this.remote = 'http://admin:password@127.0.0.1:5984/coinbase-profit';

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);
  }

  getAllTransactions() {
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

  createTransaction(transaction) {
    this.db.post(transaction);
  }

  updateTransaction(transaction) {
    this.db.put(transaction).catch((err) => {
      console.log(err);
    });
  }

  deleteTransaction(transaction) {
    this.db.remove(transaction).catch((err) => {
      console.log(err);
    });
  }

  handleChange(change) {
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
