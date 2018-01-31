class Transaction {

  _id: string;
  _rev: string;
  documentType: string;
  exchange: string;
  cryptoType: string;
  cryptoPrice: number;
  cryptoQuantity: number;
  purchaseCost: number;
  breakEvenPrice: number;
  suggestedSellPrice: number;
  complete: boolean;

}
