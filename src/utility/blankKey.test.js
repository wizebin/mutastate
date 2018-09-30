import { isBlankKey } from './blankKey';
import { expect } from 'chai';

describe('Blank Key', () => {
  describe('Basic Functionality', () => {
    it('Responds with null and empty array being blank keys', () => {
      expect(isBlankKey([])).to.equal(true);
      expect(isBlankKey(new Array())).to.equal(true);
      expect(isBlankKey(null)).to.equal(true);
      expect(isBlankKey([1, 2, 3])).to.equal(false);
    });
  });
});
