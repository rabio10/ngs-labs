import { expect } from 'chai';
import Money from '../src/money.js';

describe('Money', function () {
  describe('#add()', function () {
    let m1 = new Money(10.0, 'EUR');

      beforeEach(function () {
        // runs before each test in this block
        m1 = new Money(10.0, 'EUR');
      });

    it("should correctly add two moneys with the same currency",
      function () {

      // Given: two instances of money with the EUR currency
      let m2 = new Money(20.0, "EUR");

      // When: we add the amount of m2 to m1
      m1.add(m2);

      // Then: the new amount of m1 should be 30
      expect(m1.amount).to.equal(30.0);
    });

    it('should correctly add two moneys with different currencies', function () {
      let m2 = new Money(20.0, 'USD');

      m1.add(m2); // Add the amount of m2 up to the amount of m1. m1 est updated.

      let newAmount = m1.amount, // Retrieve the new amount
        oracle = 20.0; // Comparison to the expected result

      expect(newAmount).to.equal(oracle); // Assertion for comparison
    });

    it('should throw an exception when the currency is neither EUR nor USD', function () {
      let m2 = new Money(20.0, 'BRL'); // BZR : Brazilian real

      expect(function () {
        // Catch the exception
        m1.add(m2);
      }).to.throw();
    });
  });
});
