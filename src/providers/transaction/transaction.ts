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

}
