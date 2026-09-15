# Tree-Conver

<p align="center">
  <a href="https://huyikai.github.io/tree-conver/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="docs/public/static/logo.svg" alt="tree-conver logo">
  </a>
</p>

![npm-version](https://flat.badgen.net/npm/v/tree-conver) ![node-version](https://flat.badgen.net/npm/node/tree-conver) ![npm-downloads](https://flat.badgen.net/npm/dw/tree-conver) ![license](https://flat.badgen.net/npm/license/tree-conver)

Tree data conversion tool

English | [简体中文](./README-zhCN.md)

## Usage

```shell
npm i tree-conver
```

```javascript
// Import default export
import treeToArray from 'tree-conver';
// or Import Deconstruct Export
import { treeToArray, arrayToTree } from 'tree-conver';

// Define flat node array
// The root node pid should be null or '', and the data to be processed should have at least one item with a null pid
const myArray = [
  { uid: '1', name: 'Node 1', pid: null },
  { uid: '2', name: 'Node 2', pid: '1' },
  { uid: '3', name: 'Node 3', pid: '1' },
  { uid: '4', name: 'Node 4', pid: '2' },
  { uid: '5', name: 'Node 5', pid: '2' },
  { uid: '6', name: 'Node 6', pid: '3' }
];

// Set options, can be empty, or set only the required items
const a2tOptions = {
  idKey: 'uid', // custom id field, default 'id'
  pidKey: 'pid', // custom pid field, default 'pid'
  childrenKey: 'children' // custom children field, default 'children'
};

// Call the arrayToTree method and pass in the set parameters to convert the flat node array to a tree structure.
const myTree = arrayToTree(myArray, a2tOptions);

/**================================================================*/

// Define tree structure
const myTree = [
  {
    id: '1',
    name: 'Node 1',
    list: [
      {
        id: '2',
        name: 'Node 2',
        list: [
          {
            id: '3',
            name: 'Node 3'
          }
        ]
      },
      {
        id: '4',
        name: 'Node 4'
      }
    ]
  }
];

// Set options, can be empty, or set only the required items
const t2aOptions = {
  idKey: 'id', // The key name of the node id. default 'id'
  childrenKey: 'list', // The key name of the child node. default 'children'
  ignoreFields: [], // The list of field names to be ignored. The default value is an empty list.
  addFields: [], // The list of field names to be added and the calculation method of their corresponding attribute values. The default is an empty list.
  needParentId: true // Whether the child node needs the id of the parent node. Default is true.
};

// Call the treeToArray method and pass in the set parameters to convert the tree structure to an array
const nodes = treeToArray(tree, t2aOptions);
```

[View more usage example](https://huyikai.github.io/tree-conver/contents/Example/arrayToTree.html)

## arrayToTree

A method that converts a flat node array to a tree structure.

The implementation of this method is to first convert the given node array into a mapping with the node id as the key, and then traverse each node, find its parent node, and add it to the parent node's children property. Finally, the entire tree is constructed starting from the root node and the tree structure data is returned.

### Parameters

It takes two parameters:

- **Array** : An array of flat nodes

- **Options** : An optional object that configures the behavior of the conversion method

  | Property    | Description                                                              | Type                            | Default    |
  | ----------- | ------------------------------------------------------------------------ | ------------------------------- | ---------- |
  | childrenKey | The name of the children field                                           | string                          | 'children' |
  | idKey       | The name of the id field                                                 | string                          | 'id'       |
  | pidKey      | The name of the parent id field                                          | string                          | 'pid'      |
  | onDuplicate | Called with the list of duplicate ids (later occurrences are discarded)  | `(ids: string[]) => void`       | undefined  |
  | onOrphan    | Called with the list of dropped nodes (missing id or unknown parent pid) | `(nodes: ArrayNode[]) => void`  | undefined  |

### Discarded-node behavior

`arrayToTree` is **deterministic and pure by default** — it does NOT log to `console`. To inspect discarded nodes, pass `onDuplicate` and/or `onOrphan`:

```js
import { arrayToTree } from 'tree-conver';

const tree = arrayToTree(input, {
  onDuplicate: (ids) => console.warn('duplicate ids:', ids),
  onOrphan:    (nodes) => console.warn('orphans:', nodes)
});
```

A node is discarded when:

- it is `null` / `undefined` / not an object;
- its `idKey` field is missing, `null`, or an empty string;
- its `id` already appeared earlier in the array (the first occurrence wins);
- its `pidKey` value does not match any earlier node's `id`;
- it is part of a cyclic parent chain (e.g. `A→B→A` or `A→A`) — the whole cycle is discarded and reported via `onOrphan`.

`arrayToTree` will throw if any two of `idKey`, `pidKey`, `childrenKey` resolve to the same property — a misconfiguration that would otherwise silently corrupt data.

In the result, both `id` and `pid` are normalized to **string** when you use the default key names (`idKey='id'`, `pidKey='pid'`), so `node.id === node.pid` comparisons are always safe. When custom keys are used, the nodes are returned as-is (no synthetic `id`/`pid` fields are injected). Pre-existing `children` fields on input nodes are ignored — the tree is reconstructed purely from `pid` relations.

> **Note**: the `onOrphan` callback receives references to the original input objects — avoid mutating them in place.

### Return value

Returns an array of nodes in a tree structure.

### Complexity

- **Time Complexity**

  The time complexity of this method is O(n), where n is the length of the input array. In the method, the input array is traversed and a mapping of node id to node is created, which takes O(n) time. Then, all nodes are traversed again and added to their parent node's children array, which also takes O(n) time. Therefore, the total time complexity is O(n).

- **Space Complexity**

  The space complexity of this method is O(n), where n is the length of the array. In the method, a mapping of node id to node is created by traversing the array, and all nodes are stored in the mapping, so the space complexity is O(n). Then, all nodes in the mapping are traversed once again, and their child nodes are added to the parentNode's children property, which also has a space complexity of O(n). Therefore, the space complexity of the arrayToTree method is O(n).

## treeToArray

A method that converts tree-structured data to a flattened array.

The implementation of this method is based on breadth-first traversal of a binary tree. For each node traversed, a series of operations are performed, such as storing all of the node's properties in a new node object, deleting ignored properties, and calculating and adding required properties. After these operations, the node is saved in a new form in an array, and all node information (including descendants) contained in the array is returned.

### Parameters

It takes two parameters:

- **Tree** : A tree structure containing all nodes

- **Options** : An optional object that configures the behavior of the conversion method

  | Property     | Description                                                                                                                           | Type                                            | Default    |
  | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------- |
  | idKey        | The name of the id field                                                                                                              | string                                          | 'id'       |
  | childrenKey  | The name of the children field                                                                                                        | string                                          | 'children' |
  | ignoreFields | The list of field names to be ignored. The default value is an empty list.                                                            | string[]                                        | []         |
  | addFields    | The list of field names to be added and the calculation method of their corresponding attribute values. The default is an empty list. | [{ fieldName: string;callback: (item) => any }] | []         |
  | needParentId | Whether the child node needs the id of the parent node. Default is true.                                                              | boolean                                         | true       |

### Return value

Returns an array containing information for all nodes, including their own information and the information of their descendant nodes.

> **Note**: When a parent node is missing the `idKey` field, its descendants will receive `parentId === null`, identical to root nodes. Callers cannot distinguish "true root" from "parent without id" — please backfill ids before calling if this matters.

### Complexity

- Time Complexity

  The time complexity of this method depends on the depth and number of nodes in the tree. In the worst case, if the tree is a balanced tree and each node has multiple child nodes, the time complexity is O(nlogn). In the case where the height of the tree is small, even if each node has multiple child nodes, the time complexity is still O(n), where n is the number of nodes. The method uses a stack to implement iteration to reduce memory usage and nested call stacks. Therefore, the method can be efficiently implemented in most cases.

- Space Complexity

  The space complexity of this method is O(n), where n is the number of nodes in the tree. Because the implementation of the method does not use recursion, but uses iteration to implement depth-first traversal with a stack. The maximum length of the node array stored in the stack is the depth of the tree, so the space complexity is O(n).

## Website

[huyikai.github.io/tree-conver/](https://huyikai.github.io/tree-conver/)

## Repository

https://github.com/huyikai/tree-conver.git

## License

[MIT](./license)
