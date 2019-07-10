export default function singleton() {
  if (singleton.singleton === undefined) {
    singleton.singleton = new Mutastate();
  }
  return singleton.singleton;
}
