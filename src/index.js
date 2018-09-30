import { Mutastate } from './Mutastate';
function singleton() {
  if (singleton.singleton === undefined) {
    singleton.singleton = new Mutastate();
  }
  return singleton.singleton;
}
function initializeSingleton(parameters) {
  singleton().initialize(parameters);
}

const mutastate = {
  Mutastate,
  singleton,
  initialize: initializeSingleton,
}

export * from mutastate;
export default mutastate;
