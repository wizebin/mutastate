import changeWrapper from './changeWrapper';

describe('changeWrapper', () => {
  it('wraps basic changes', () => {
    let a = {};
    let hasChanged = false;
    const b = changeWrapper(a, (value) => { hasChanged = true });
    expect(hasChanged).toEqual(false);
    a.b = 6;
    expect(hasChanged).toEqual(false);
    b.b = 6;
    expect(hasChanged).toEqual(true);
  });
  it('wraps deletes', () => {
    let a = { b: '5' };
    let hasChanged = false;
    let change = null;
    const proxd = changeWrapper(a, (value) => { change = value });
    delete(proxd.b);
    expect(change).toEqual({ key: ['b'], type: 'delete' });
  });
  it('wraps subobjects', () => {
    let original = { b: '5' };
    let change = null;
    const proxd = changeWrapper(original, (data) => { change = data });
    proxd.c = { q: 'r' };
    expect(change).toEqual({ key: ['c'], type: 'set', value: { q: 'r' } });
    change = null;
    proxd.c.f = 'hi';
    expect(change).toEqual({ key: ['c', 'f'], type: 'set', value: 'hi' });
    change = null;
    proxd.c.f = 'bye';
    expect(change).toEqual({ key: ['c', 'f'], type: 'set', value: 'bye' });
  });
  it('wraps arrays', () => {
    let original = [1];
    let change = []
    let proxd = changeWrapper(original, (data) => { change.push(data) });
    proxd.push(5);
    expect(change).toEqual([{key: ['1'], type: 'set', value: 5 }]);
    change = []
    proxd.pop();
    expect(change).toEqual([{key: ['1'], type: 'delete' }]);
  });
})
