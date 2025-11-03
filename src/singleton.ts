import Mutastate from './Mutastate';

let mutastateInstance: Mutastate;

export default function singleton(): Mutastate {
  if (!mutastateInstance) {
    mutastateInstance = new Mutastate();
  }
  return mutastateInstance;
}