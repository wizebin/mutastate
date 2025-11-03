/**
 * Get a Promise implementation
 * @returns {Promise} Promise implementation
 */
export default function getPromiseFunction(): PromiseConstructor {
  try {
    return Promise;
  } catch (err) {
    try {
      const bluebird = require('bluebird');
      return bluebird;
    } catch (err2) {
      throw new Error('No promise implementation available');
    }
  }
}
