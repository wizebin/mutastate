import changeWrapper from './changeWrapper';
import { expect } from 'chai';

describe('changeWrapper', () => {
  it('wraps basic changes', () => {
    let a = {};
    let hasChanged = false;
    const b = changeWrapper(a, (value) => { hasChanged = true });
    expect(hasChanged).to.equal(false);
    a.b = 6;
    expect(hasChanged).to.equal(false);
    b.b = 6;
    expect(hasChanged).to.equal(true);
  });
  it('wraps deletes', () => {
    let a = { b: '5' };
    let hasChanged = false;
    let change = null;
    const proxd = changeWrapper(a, (value) => { change = value });
    delete(proxd.b);
    expect(change).to.deep.equal({ key: ['b'], type: 'delete' });
  });
  it('wraps subobjects', () => {
    let original = { b: '5' };
    let change = null;
    const proxd = changeWrapper(original, (data) => { change = data });
    proxd.c = { q: 'r' };
    expect(change).to.deep.equal({ key: ['c'], type: 'set', value: { q: 'r' } });
    change = null;
    proxd.c.f = 'hi';
    expect(change).to.deep.equal({ key: ['c', 'f'], type: 'set', value: 'hi' });
    change = null;
    proxd.c.f = 'bye';
    expect(change).to.deep.equal({ key: ['c', 'f'], type: 'set', value: 'bye' });
  });
  it('wraps arrays', () => {
    let original = [1];
    let change = []
    let proxd = changeWrapper(original, (data) => { change.push(data) });
    proxd.push(5);
    expect(change).to.deep.equal([{key: ['1'], type: 'set', value: 5 }]);
    change = []
    proxd.pop();
    expect(change).to.deep.equal([{key: ['1'], type: 'delete' }]);
  });
})
