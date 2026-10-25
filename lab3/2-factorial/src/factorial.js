/**
 * Return the factorial of i.
 * @param {number} i - an integer number.
 * @return {number} the factorial of i.
 */
export const factorial = function (i) {
  // To complete.
  if (!Number.isInteger(i)) {
    throw new Error('Input must be an integer');
  }
  if (i < 0) {
    throw new Error('Input must be a non-negative integer');
  }
  if (i === 0) {
    return 1;
  }
  return i * factorial(i - 1);
};

export default factorial;
