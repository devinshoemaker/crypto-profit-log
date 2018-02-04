class Transaction {

  _id: string;
  _rev: string;
  documentType: string;
  exchange: string;
  cryptocurrency: string;
  price: number;
  quantity: number;
  cost: number;
  breakEvenPrice: number;
  suggestedSellPrice: number;
  complete: boolean;

}
