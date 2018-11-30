import Mutastate from './Mutastate';
import { expect } from 'chai';

describe('Mutastate', () => {
  describe('Save and load', () => {
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
      let agentData2 = {};
      const agent2 = manager.getAgent(data => { agentData2 = data; });
      agent.listen('first', { alias: 'flipper' });
      agent.listen('second');
      agent.listen('third');
      agent2.listen('third');
      manager.set('first', 'bingo');
      manager.set('second', 'bongo');
      manager.set('third', []);

      updateCount = 0;
      agentData.flipper = 'johnny';
      expect(updateCount).to.equal(1);

      updateCount = 0;
      agentData.second = 'bango';
      expect(updateCount).to.equal(1);

      updateCount = 0;
      agentData.third.push('another');
      expect(updateCount).to.equal(1);

      expect(manager.get('third')).to.deep.equal(['another']);
      expect(agentData2.third).to.deep.equal(['another']);

      updateCount = 0;
      agent2.push('third', 'qwop');
      expect(updateCount).to.equal(1);

      expect(manager.get('first')).to.equal('johnny');
      expect(manager.get('second')).to.equal('bango');
      expect(manager.get('third')).to.deep.equal(['another', 'qwop']);
      expect(agentData2.third).to.deep.equal(['another', 'qwop']);
    });
    it('executes basic translations', () => {
      const manager = new Mutastate();
      let agentData = {};
      let updateCount = 0;
      const agent = manager.getProxyAgent(data => {
        agentData = data;
        updateCount += 1;
      });
      agent.listen('b', { alias: 'q' });
      manager.translate('a', 'b', input => input + '2');

      updateCount = 0;
      manager.set('a', 'jello');
      expect(updateCount).to.equal(1);

      expect(manager.get('a')).to.equal('jello');
      expect(manager.get('b')).to.equal('jello2');
      expect(agentData.q).to.deep.equal('jello2');
    });
    it('executes advanced translations', () => {
      const manager = new Mutastate();
      let agentData = {};
      let updateCount = 0;
      const agent = manager.getProxyAgent(data => {
        agentData = data;
        updateCount += 1;
      });
      agent.listen('translated', { alias: 'tran' });
      agent.translate('original', 'translated', input => (input || []).reduce((result, item, dex) => {
        result[item.id] = { key: `original[${dex}]`, value: item };
        return result;
      }, {}));

      updateCount = 0;

      manager.set('original', [{ id: 1, name: 'bob' }, { id: 2, name: 'jimmy' }]);
      expect(updateCount).to.equal(1);

      expect(agentData.tran).to.deep.equal({
        1: { key: `original[0]`, value: { id: 1, name: 'bob' } },
        2: { key: `original[1]`, value: { id: 2, name: 'jimmy' } }
      });
    });
    it('keeps translations after cleanup of agent if required', () => {
      const manager = new Mutastate();
      const agent = manager.getProxyAgent(() => {});
      agent.translate('original', 'translated', input => input + 2, { killOnCleanup: false });
      manager.set('original', 2);
      expect(manager.get('original')).to.equal(2);
      expect(manager.get('translated')).to.equal(4);

      agent.cleanup();

      manager.set('original', 5);
      expect(manager.get('original')).to.equal(5);
      expect(manager.get('translated')).to.equal(7);
    });
    it('kills translations during cleanup of agent if required', () => {
      const manager = new Mutastate();
      const agent = manager.getProxyAgent(() => {});
      agent.translate('original', 'translated', input => input + 2, { killOnCleanup: true });
      manager.set('original', 2);
      expect(manager.get('original')).to.equal(2);
      expect(manager.get('translated')).to.equal(4);

      agent.cleanup();

      manager.set('original', 5);
      expect(manager.get('original')).to.equal(5);
      expect(manager.get('translated')).to.equal(4);
    });

    // IF THIS TURNS INTO A BLINKER (sometimes failing) INCREASE THE TIMEOUT FROM 80 TO SOMETHING HIGHER LIKE 200
    it('throttles translations if required', (done) => {
      const manager = new Mutastate();
      let agentData = [];
      let updateCount = 0;
      const agent = manager.getProxyAgent(data => {
        agentData.push(data);
        updateCount += 1;
      });
      agent.translate('original', 'translated', input => input + 2, { throttleTime: 10 });
      agent.listen('translated');
      updateCount = 0;
      const loopCount = 100;
      for(let dex = 0; dex < loopCount; dex += 1) {
        manager.set('original', dex);
      }
      setTimeout(() => {
        expect(updateCount).to.be.lessThan(20);
        expect(manager.get('original')).to.equal(99);
        expect(manager.get('translated')).to.equal(101);
        done();
      }, 80);
    });
    it('allows global hooks', () => {
      const manager = new Mutastate();
      let changes = [];
      const changeHook = data => changes.push(data);
      manager.addChangeHook(changeHook);
      const agent = manager.getProxyAgent();
      agent.listen('phio', { alias: 'indifferent', defaultValue: 0 });
      manager.set('phio', 1);
      agent.data.indifferent = 2;
      expect(changes).to.deep.equal([
        { key: ['phio'], value: 0, meta: { defaultValue: true } },
        { key: ['phio'], value: 1 },
        { key: ['phio'], value: 2 },
      ]);
    });
    it('setEverything notifies children of updates', () => {
      const manager = new Mutastate();
      const agent = manager.getProxyAgent();
      const agent2 = manager.getProxyAgent();
      agent.listen('basic');
      agent2.listen('nonbasic')
      manager.set('basic', 'first');

      manager.setEverything({ basic: 'second', nonbasic: 'third' });
      expect(agent.data).to.deep.equal({ basic: 'second' });
      expect(agent2.data).to.deep.equal({ nonbasic: 'third' });
      manager.setEverything({});
      expect(agent.data).to.deep.equal({ basic: undefined });
      expect(agent2.data).to.deep.equal({ nonbasic: undefined });
      manager.setEverything({ nonbasic: { forth: 'fifth' }});
      expect(agent.data).to.deep.equal({ basic: undefined });
      expect(agent2.data).to.deep.equal({ nonbasic: { forth: 'fifth' } });
      manager.setEverything({ nonbasic: { forth: 'sixth' }});
      expect(agent.data).to.deep.equal({ basic: undefined });
      expect(agent2.data).to.deep.equal({ nonbasic: { forth: 'sixth' } });
    });
    it('applies defaults to setEverything', () => {
      const manager = new Mutastate();
      const agent = manager.getProxyAgent();
      agent.listen('basic', { defaultValue: 'ohio' });

      expect(agent.data.basic).to.equal('ohio');
      expect(manager.data).to.deep.equal({ basic: 'ohio' });

      manager.setEverything({ unrelated: 5 });

      expect(agent.data.basic).to.equal('ohio');
      expect(manager.data).to.deep.equal({ basic: 'ohio', unrelated: 5 });
    });
  });
});
