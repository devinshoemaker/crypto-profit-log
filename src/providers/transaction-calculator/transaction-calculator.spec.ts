import { TransactionCalculatorProvider } from './transaction-calculator';

/**
 * `TransactionCalculatorProvider` unit tests.
 *
 * @author Devin Shoemaker (devinshoe@gmail.com)
 */
describe('Transaction Calculator provider', () => {

  it('should calculate cost correctly', () => {
    expect(TransactionCalculatorProvider.calculateCost(1, 10, 0.001)).toBe(10.02);
  });

  it('should calculate the break even price correctly', () => {
    expect(TransactionCalculatorProvider.calculateBreakEvenPrice(10, 0.001)).toBe(10.02);
  });

  it('should calculate the suggested sell price correctly', () => {
    expect(TransactionCalculatorProvider.calculateSuggestedSellPrice(10.02)).toBe(11.022);
  });

});
