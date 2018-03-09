import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Calculation methods for cryptocurrency purchases.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
@Injectable()
export class TransactionCalculatorProvider {

  constructor(public http: HttpClient) {}

  /**
   * Calculate the cost of the transaction in the currency the user is buying in.
   *
   * @param {number} quantity The quantity of the cryptocurrency.
   * @param {number} price The purchase price of the cryptocurrency.
   * @param {number} transactionFeePercentage The transaction fee percentage for the purchase.
   * @returns {number} The cost of the transaction.
   */
  public static calculateCost(quantity: number, price: number, transactionFeePercentage: number) {
    return (quantity * price) * (1 + (transactionFeePercentage * 2));
  }

  /**
   * Calculate the price that the crypto must be at for the user to break even.
   *
   * @param {number} price The purchase price of the cryptocurrency.
   * @param {number} transactionFeePercentage The transaction fee percentage for the purchase.
   * @returns {number} The break even price of the purchase.
   */
  public static calculateBreakEvenPrice(price: number, transactionFeePercentage: number) {
    return price * (1 + (transactionFeePercentage * 2));
  }

  /**
   * Calculate the recommended price of the crypto for the user to make a decent profit.
   *
   * @param {number} breakEvenPrice The break even price of the purchase.
   * @returns {number} The suggested sell price to make a profit.
   */
  public static calculateSuggestedSellPrice(breakEvenPrice: number) {
    return breakEvenPrice * 1.1;
  }

}
