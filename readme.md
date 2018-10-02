## Description

Mutastate is designed to manage state and send notifications to listeners when state changes.

## install

`npm install --save mutastate`

## Use with React

This example demonstrates how to create a connected react component, this particular component listens for data in the default shard, under the key `['default', 'assignments', props.id]`. This means if the data at that key is updated, this component will receive new an update indicating the new data.

It is important to note that the common pattern of incoming props checking for component updating when using mutastate will not apply, unless you make a deep copy of your incoming props for comparison yourself. The data passed into your component will be the original data.

Indicating `{ useProxy: true }` will allow you to modify the data directly (only simple data, objects, arrays, strings, numbers, no custom classes or functions) as we do in this example (see `assignment.count += 1`). The data will not, in fact, be modified; the modification will be captured and converted into function calls to the current mutastate. (the previous `assignment.count += 1` becomes `mutastate.set('default.assignments[1].count', assignment.count + 1)`)

Also please note that the function is `withMutastateCreator` instead of `withMutastate`, this is to avoid the ambiguity of having a separate repository for react, this is subject to change in a major version far in the future, currently if you want a `withMutastate` function you can create one by executing: `const withMutastate = withMutastateCreator(React, { useProxy: true });`;


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
* get(key)
* set(key, value)
* delete(key)
* assign(key, value)
* push(key, value)
* pop(key, value)
* has(key)
* getEverything(key)
* setEverything(key)

These functions are accessible throught the agent props object (this can be modified by passing agentName into your withMutastateCreator function) like so:
`this.props.agent.set('default.bobby', 'tables');`
