import Mutastate from './Mutastate';
import withMutastateCreator from './WithMutastate';

function singleton() {
  if (singleton.singleton === undefined) {
    singleton.singleton = new Mutastate();
  }
  return singleton.singleton;
}

export { Mutastate, singleton, withMutastateCreator };
export default Mutastate;
