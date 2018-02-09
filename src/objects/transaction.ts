class Transaction {

  _id: string;
  _rev: string;
  date: Date;
  exchange: string;
  cryptocurrency: string;
  price: number;
  quantity: number;
  cost: number;
  breakEvenPrice: number;
  suggestedSellPrice: number;
  complete: boolean;

}
