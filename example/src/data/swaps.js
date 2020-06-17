import { singleton } from 'mutastate';

export function swapLeftAndRight() {
  const temp = singleton().get('right');

  singleton().set('right', singleton().get('left') || '');
  singleton().set('left', temp || '');
}

export function mixStrings(first = '', second = '') {
  let result = ''
  for(let dex = 0; dex < first.length; dex += 1) {
    if (Math.floor(Math.random() * 100) > 50) {
      result += first[Math.floor(Math.random() * first.length)];
    } else {
      result += second[Math.floor(Math.random() * second.length)];
    }
  }
  return result;
}

export function mixLeftAndRight() {
  const tempRight = singleton().get('right');
  const tempLeft = singleton().get('left');

  singleton().set('right', mixStrings(tempLeft, tempRight));
  singleton().set('left', mixStrings(tempLeft, tempRight));
}
