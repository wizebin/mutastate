## Description

Mutastate is designed to manage state and send notifications to listeners when state changes.

## install

`npm install --save mutastate`

## Api

importables
```javascript
import Mutastate, {
    withMutastateCreator,
} from 'mutastate';
```

#### Mutastate (default import)
The mutastate class, this class is responsible for maintaining state and sending notifications to listeners
```javascript
import Mutastate from 'mutastate';
const mutastate = new Mutastate();
mutastate.set('foghorn', 'leghorn');
console.log(mutastate.get('foghorn')) // returns leghorn
```

*Functions*
* `getAgent(onChangeFunction)`
    * Get a new mutastate agent attached to this instance of mutastate
* `getProxyAgent(onChangeFunction)`
    * Get a new proxy enabled mutastate agent attached to this instance
* `listen(key, listener = { callback: () => {}}, alias: null, batch: null, transform: null, defaultValue: undefined })`
    * listen for changes, notify callback when they occur, defaultValue will directly affect the current data if nothing exists! use batch for easy batch unlistening
* `unlisten(key, callback)`
    * Unlisten from a single key with a single known callback function
* `unlistenBatch(batch, basePath)`
    * Unlisten from all associated triggers for one given batch which was passed into listen
* `getForListener(key, listener, keyChange)`
    * Get data for a given key and listener, this is used by agents to get initial data, and internally to get relevant data upon updating
* `get(key)`
    * Get data at a single key, key can be a string with delimiters or an array 'a.b.c[0]' is equivalent to ['a', 'b', 'c', 0]
* `set(key, value, options)`
    * Set data.key to value, key can be complex as in get()
* `delete(key)`
    * Remove data.key, key can be complex as in get()
* `assign(key, value)`
    * Merge value into data.key object, key can be complex as in get()
* `push(key, value, options)`
    * Add value to the end of the array at data.key, key can be complex as in get()
* `pop(key, options)`
    * Remove final value from the end of the array at data.key, key can be complex as in get()
* `has(key)`
    * If the key exists at data.key, return true, otherwise return false, key can be complex as in get()
* `getEverything()`
    * return all data for all shards
* `setEverything(data)`
    * update all data for all shards
* `addChangeHook(callback)`
    * notify callback whenever any data changes, `({ key: [], value: any, meta: { defaultValue: true|undefined, setEverything: true|undefined }}) => {}` this is most useful for automated persistence functionality
* `removeChangeHook(callback)`
    * stops notifying callback on any data change

#### Mutastate Agent

*functions*
* `new MutastateAgent(mutastateInstance, callbackFunction)` or `mutastateInstance.getAgent(callbackFunction)`
    * Connect to the mutastateInstance and execute callbackFunction when data changes.
* `listen(key, { alias, transform, initialLoad = true, defaultValue } = {})`
    * Listen for changes at key in mutastate, then call `callbackFunction` from the constructor
* `listenFlat(key, { alias, transform, initialLoad = true, defaultValue } = {})`
    * Listen for data at key, automatically set alias to the last key section. ['a', 'b', 'c'] sets the alias to 'c'
* `batchListen(childFunction)`
    * Execute a lambda, during the lambda execution don't send callback information, after the lambda execute the callback
* `multiListen(listeners, { flat = true } = {})`
    * Same as listen or listenFlat, but include a { key } in the listener
* `get(key)`
    * Get data at key from mutastate
* `set(key, value)`
    * Set data at key in mutastate
* `delete(key)`
    * Delete data at key in mutastate
* `assign(baseKey, value)`
    * Perform an Object.assign() on the object that is at the baseKey in mutastate
* `push(baseKey, value)`
    * Push into an array found at baseKey in mutastate
* `pop(key)`
    * Remove the last item in an array found at key
* `has(key)`
    * Detect if mutastate contains data at this key
* `assure(key, defaultValue)`
    * If `has` fails on this `key`, use `set` at that `key` with `defaultValue`
* `getEverything()`
    * Return all of mutastate
* `setEverything(data)`
    * Overwrite all data in mutastate
* `getAgentData()`
    * Get current agent data (including aliased data)
* `pause()`
    * Pause callback (data will still flow to the agent unless you manually unlisten)
* `resume()`
    * Resume callbacks, you may want to manually re-target information found in getAgentData after resuming
* `resolve(aliasedKey)`
    * Resolve an alias to the full mutastate path. `agent.listen('a.b.c', { alias: 'bobby' });` then `agent.resolve('bobby')` will return `['a', 'b', 'c']`

## Use with React

This example demonstrates how to create a connected react component, this particular component listens for data in the default shard, under the key `['default', 'assignments', props.id]`. This means if the data at that key is updated, this component will receive an update including the new data.

It is important to note that the common pattern of incoming props checking for component updating when using mutastate will not function correctly, unless you make a deep copy of your incoming props for comparison yourself. The data passed into your component will be mutated!

Indicating `{ useProxy: true }` will allow you to modify the data directly (only simple data, objects, arrays, strings, numbers, no custom classes or functions) as we do in this example (see `assignment.count += 1`). The data will not, in fact, be modified; the modification will be captured and converted into function calls to the current mutastate. (the previous `assignment.count += 1` becomes `mutastate.set('default.assignments[1].count', assignment.count + 1)`)

Also please note that the function is `withMutastateCreator` instead of `withMutastate`, this is to avoid the ambiguity of having a separate repository for react, this is subject to change in a major version far in the future, currently if you want a `withMutastate` function you can create one by executing: `const withMutastate = withMutastateCreator(React, { instance: yourMutastateInstance, useProxy: true });`;

```javascript
import React from 'react';
import { withMutastateCreator } from 'mutastate';

class Assignment extends React.Component {
    constructor(props) {
        super(props);
        props.agent.listen(['default', 'assignments', props.id], { alias: 'assignment', defaultValue: { name: 'john', count: 0, list: [] } });
    }
    render() {
        const { assignment } = this.props.data;

        return (
            <div>
                <div>{assignment.name}</div>
                <div>{assignment.count}</div>
                <div>{JSON.stringify(assignment.list)}</div>
                <button onClick={() => assignment.count += 1}>Add To Count</button>
                <button onClick={() => assignment.name = ['a', 'b', 'c'][Math.floor(Math.random() * 3)]}>Change Name</button>
                <button onClick={() => assignment.list.push('another')}>Add To List</button>
            </div>
        );
    }
}

export default withMutastateCreator(React, { useProxy: true })(Assignment);
```

The use of `useProxy` will limit your browser availability due to use of the Proxy es6 feature:
* No internet explorer
* No opera mini
* Edge 17
* Firefox 18
* Chrome 49
* Safari 10
* Samsung mobile 5
* Chrome android 69
* UC android 11.8

If you must avoid `useProxy`, the following mutastate methods are available:
* `get(key)`
* `set(key, value)`
* `delete(key)`
* `assign(key, value)`
* `push(key, value)`
* `pop(key, value)`
* `has(key)`
* `getEverything(key)`
* `setEverything(key)`
