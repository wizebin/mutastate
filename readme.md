## Description

Nexustate is designed to manage state and send notifications to listeners when state changes.

## install

`npm install --save nexustate`

## API Reference

### Nexustate({ saveCallback = null, loadCallback = null, storageKey = 'default', persist = false })

*parameters:*

* `persist`: Save and load this state? Changes will be loaded using the `load()` function and saved after changes occur or with the `save()` function
* `saveCallback`: This function will be called on a throttled interval when your state changes if persist is true
* `loadCallback`: This function is called when the `load()` function is called, `load()` must be called manually unless using `getNexustate()`
* `storageKey`: When calling the `saveCallback` and `loadCallback`, this key is the root key

*response:*

New instance of Nexustate

*example:*

    import { Nexustate } from 'nexustate';

    const saveState = {};
    const state = new Nexustate({ saveCallback: (key, value) => { saveState[key] = value; }, loadCallback: (key) => saveState[key] });
    const logChange = (data) => console.log;

    state.listen({ key: ['some', 'key'], callback: logChange });

    state.set({ some: { key: 'hello' } });

    // logChange is called with the value 'hello'
    // saveState['default'] is changed to { some: { key: 'hello' } };

### Nexustate.set(object, options = { immediatePersist: false, noNotify: false })

*parameters:*

* `object`: Apply this object into the current state
* `options.immediatePersist`: Don't throttle the save function, call it immediately. Useful for tests
* `options.noNotify`: Don't send notifications to listeners

*response:*

Current full state

*example:*

    state.set({ some: { key: 'hello' } }, { immediatePersist: true });

### Nexustate.setKey(key, object, options = { immediatePersist: false, noNotify: false })

*parameters:*

* `key`: String or array representing the location we want to change, this value does not have to already exist for set to work
* `object`: Apply this object into the current state
* `options.immediatePersist`: Don't throttle the save function, call it immediately. Useful for tests
* `options.noNotify`: Don't send notifications to listeners

*response:*

Current full state

*example:*

    state.setKey(['a', 'b', 'c'], 'hi');

    state.get(null) // returns { a: { b: { c: 'hi' } } };

### Nexustate.listen({ key: null, callback: () => {}, alias: null, component: null, transform: null, noChildUpdates: false })

*parameters:*

* `key`: String or array for the path we want to listen for changes in
* `callback`: When something changes in that path, run this callback with the new data
* `alias`: Send this alias along with the change to callback
* `component`: Used as a reference to remove all callbacks for a given entity using unlistenComponent
* `transform`: Function to transform the incoming data before executing callback
* `noChildUpdates`: Don't listen for any updates to nested child records

*response:*

Success boolean

*example:*

    state.listen({ key: 'a.b.c', data => console.log , alias: 'boop', transform: value => `+++${value}` });


