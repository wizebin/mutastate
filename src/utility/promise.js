import bluebird from 'bluebird';

export default function getPromiseFunction() {
  if (typeof global !== 'undefined' && typeof global.Promise !== 'undefined') {
    return global.Promise;
  } else if (typeof window !== 'undefined' && typeof window.Promise !== 'undefined') {
    return window.Promise;
  }
  return bluebird;
}
