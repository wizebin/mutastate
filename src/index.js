import Mutastate, { getLocalStorageSaveFunc, getLocalStorageLoadFunc } from './Mutastate';
import withMutastateCreator from './WithMutastate';

function singleton() {
  if (singleton.singleton === undefined) {
    singleton.singleton = new Mutastate();
  }
  return singleton.singleton;
}
function initializeSingleton(parameters) {
  return singleton().initialize(parameters);
}

const mutastate = {
  Mutastate,
  singleton,
  initializeSingleton,
  withMutastateCreator,
  getLocalStorageLoadFunc,
  getLocalStorageSaveFunc,
}

export { Mutastate, singleton, initializeSingleton, withMutastateCreator, getLocalStorageLoadFunc, getLocalStorageSaveFunc };
export default mutastate;
