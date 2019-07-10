import { isBlankKey } from './blankKey';

describe('Blank Key', () => {
  describe('Basic Functionality', () => {
    it('Responds with null and empty array being blank keys', () => {
      expect(isBlankKey([])).toEqual(true);
      expect(isBlankKey(new Array())).toEqual(true);
      expect(isBlankKey(null)).toEqual(true);
      expect(isBlankKey([1, 2, 3])).toEqual(false);
    });
  });
});
