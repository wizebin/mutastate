import Mutastate, { getLocalStorageLoadFunc, getLocalStorageSaveFunc } from './Mutastate';
import { set } from 'objer';
import { expect } from 'chai';
import { equal } from 'assert';
const TEST_STORAGE_KEY = 'TESTTESTTEST';

function getTestFunctions() {
  let lambdaData = {};
  return {
    save: (shard, data) => lambdaData[shard] = data,
    load: (shard) => lambdaData[shard],
  };
}

function getTestPromiseFunctions() {
  let lambdaData = {};
  return {
    save: (shard, data) => {
      lambdaData[shard] = data
      return Promise.resolve(lambdaData);
    },
    load: (shard) => {
      return Promise.resolve(lambdaData[shard]);
    },
  };
}

describe('Mutastate', () => {
  describe('Save and load', () => {
    it('saves and loads shards', () => {
      const manager = new Mutastate();
      const manager2 = new Mutastate();

      const testFunctions = getTestFunctions();

      manager.initialize({ shards: ['first'], save: testFunctions.save, load: testFunctions.load });
      manager2.initialize({ shards: ['first', 'third'], save: testFunctions.save, load: testFunctions.load });

      manager.assign('first', { fishy: 'fist' });
      manager.assign('second', { spooky: 'ghost' });

      expect(manager.getEverything()).to.deep.equal({ first: { fishy: 'fist' }, second: { spooky: 'ghost' } });
      expect(manager2.getEverything()).to.deep.equal({ first: undefined, third: undefined });
      expect(manager.get('first.fishy')).to.deep.equal('fist');
      expect(manager2.get('first.fishy')).to.deep.equal(undefined);

      manager.save();
      manager.load();
      manager2.load();

      // Notice the missing 'second' key, we didn't indicate we wanted to save or load in manager.initialize
      expect(manager.getEverything()).to.deep.equal({ first: { fishy: 'fist' } });
      expect(manager2.getEverything()).to.deep.equal({ first: { fishy: 'fist' }, third: undefined });
      expect(manager.get('first.fishy')).to.deep.equal('fist');
      expect(manager2.get('first.fishy')).to.deep.equal('fist');
    });
    it('saves and loads via promise', (done) => {
      const testFunctions = getTestPromiseFunctions();

      const manager = new Mutastate();
      manager.initialize({ shards: ['myth'], save: testFunctions.save, load: testFunctions.load });

      manager.assign('myth', { a: 'b' });
      manager.save();
      manager.setEverything(null);
      expect(manager.getEverything()).to.deep.equal(null);
      manager.load().then(() => {
        expect(manager.getEverything()).to.deep.equal({ myth: { a: 'b' } });
        done();
      });
    });
    it('cruds', () => {
      const manager = new Mutastate();
      let agentData = {};
      const agent = manager.getAgent(data => {
        agentData = data
      });
      agent.listen('speckled.bobs', { alias: 'speks' });
      manager.set('speckled', { dots: 5, bits: 9 });
      expect(manager.getEverything()).to.deep.equal({ speckled: { dots: 5, bits: 9 } });
      manager.delete('speckled.dots');
      expect(manager.getEverything()).to.deep.equal({ speckled: { bits: 9 } });
      manager.delete('speckled.dots');
      expect(manager.getEverything()).to.deep.equal({ speckled: { bits: 9 } });
      expect(agentData).to.deep.equal({ speks: undefined });
      manager.set('speckled.bobs', []);
      expect(agentData).to.deep.equal({ speks: [] });
      expect(manager.getEverything()).to.deep.equal({ speckled: { bits: 9, bobs: [] } });
      manager.push('speckled.bobs', 'first');
      expect(manager.getEverything()).to.deep.equal({ speckled: { bits: 9, bobs: ['first'] } });
      manager.push('speckled.bobs', 'second');
      expect(manager.getEverything()).to.deep.equal({ speckled: { bits: 9, bobs: ['first', 'second'] } });
      manager.pop('speckled.bobs');
      expect(manager.getEverything()).to.deep.equal({ speckled: { bits: 9, bobs: ['first'] } });
      expect(agentData).to.deep.equal({ speks: ['first'] });
    });
    it('proxy agents', () => {
      const manager = new Mutastate();
      let agentData = {};
      let updateCount = 0;
      const agent = manager.getProxyAgent(data => {
        agentData = data;
        updateCount += 1;
      });
      agent.listen('first', { alias: 'flipper' });
      manager.set('first', 'bingo');
      expect(updateCount).to.equal(2);
      agentData.flipper = 'johnny'; //Doesn't currently work, changing to johnny and removing the alias does work
      expect(updateCount).to.equal(3);
      expect(manager.get('first')).to.equal('johnny');
    });
  });
});
