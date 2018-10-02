import { getObjectPath } from "objer";

// const handleGetCreator = () => (target, property, receiver) => {
//   console.log('getting', property)
//   try {
//     return new Proxy(target[property], handler);
//   } catch (err) {
//     return Reflect.get(target, property, receiver);
//   }
// }

// const handleDefineCreator = ({ meta, onChange }) => (target, property, descriptor) => {
//   onChange({ type: 'define', property, meta });
//   return Reflect.defineProperty(target, property, descriptor);
// }

// const handleDeleteCreator = ({ meta, onChange }) => (target, property) => {
//   onChange({ type: 'delete', property, meta });
//   return Reflect.deleteProperty(target, property);
// }

// const handleSetCreator = ({ meta, handleDefine, onChange }) => (target, property, value, receiver) => {
//   const incomingTypeString = getTypeString(value);

//   if (incomingTypeString === 'object') {
//     const passMeta = { ...(meta || {}), key: ((meta && meta.key) || []).concat(property) };
//     console.log('creating proxy thing at', property)
//     target[property] = wrapChanges(value, onChange, passMeta);
//   } else {
//     console.log('not proxying', property)
//     target[property] = value;
//   }

//   handleDefine(target, property, { value });

//   return true;
// }

// function wrapChanges(object, onChange, meta) {
//   if (!meta) meta = { key: [] };
//   // const handleGet = handleGetCreator({ meta });
//   const handleDefine = handleDefineCreator({ meta, onChange });
//   const handleDelete = handleDeleteCreator({ meta, onChange });
//   const handleSet = handleSetCreator({ meta, onChange, handleDefine });

//   const handler = {
//     // get: handleGet,
//     defineProperty: handleDefine,
//     deleteProperty: handleDelete,
//     set: handleSet,
//   };

//   return new Proxy(object, handler);
// };


function getHandler(onChange, keyInput) {
	const key = getObjectPath(keyInput);
  const handler = {
		get(target, property, receiver) {
			try {
				return new Proxy(target[property], getHandler(onChange, key.concat(property)));
			} catch (err) {
				return Reflect.get(target, property, receiver);
			}
		},
		set(target, property, value) {
			if (!(target instanceof Array && property === 'length')) { // ignore length changes
				onChange({ type: 'set', key: key.concat(property), value });
			}

			return Reflect.set(target, property, value);
		},
		// defineProperty(target, property, descriptor) {
		// 	onChange({ type: 'define', key: key.concat(property) });
		// 	return Reflect.defineProperty(target, property, descriptor);
		// },
		deleteProperty(target, property) {
			onChange({ type: 'delete', key: key.concat(property) });
			return Reflect.deleteProperty(target, property);
		}
	};
  return handler;
}

module.exports = (object, onChange) => {
	return new Proxy(object, getHandler(onChange, []));
};
