# Tree-Conver

Tree data conversion tool

[简体中文](https://github.com/huyikai/tree-conver/blob/main/README-zhCN.md)

## Usage

```shell
npm i tree-conver
```

```javascript
// Import default export
import treeToArray from "tree-conver"
// or Import Deconstruct Export
import { treeToArray, arrayToTree } from "tree-conver"

// Define flat node array
// The root node pid should be null or '', and the data to be processed should have at least one item with a null pid
const myArray = [
  { uid: '1', name: 'Node 1', pid: null },
  { uid: '2', name: 'Node 2', pid: '1' },
  { uid: '3', name: 'Node 3', pid: '1' },
  { uid: '4', name: 'Node 4', pid: '2' },
  { uid: '5', name: 'Node 5', pid: '2' },
  { uid: '6', name: 'Node 6', pid: '3' },
];

// Set options, can be empty, or set only the required items
const a2tOptions = {
  idKey: 'uid', // custom id field, default 'id'
  pidKey: 'pid', // custom pid field, default 'pid'
  childrenKey: 'children' // custom children field, default 'children'
}

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
  childrenKey: 'list', // The key name of the child node. default 'children'
  ignoreFields: [], // The list of field names to be ignored. The default value is an empty list.
  addFields: [], // The list of field names to be added and the calculation method of their corresponding attribute values. The default is an empty list.
  needParentId: true // Whether the child node needs the id of the parent node. Default is true.
}

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

  | Property    | Description                                  | Type   | Default    |
  | ----------- | -------------------------------------------- | ------ | ---------- |
  | childrenKey | The name of the children field                | string | 'children' |
  | idKey       | The name of the id field                      | string | 'id'       |
  | pidKey      | The name of the parent id field                | string | 'pid'      |




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

  | Property    | Description                                  | Type   | Default    |
  | ----------- | -------------------------------------------- | ------ | ---------- |
  | childrenKey | The name of the children field                | string | 'children' |
  | idKey       | The name of the id field                      | string | 'id'       |
  | pidKey      | The name of the parent id field                | string | 'pid'      |
  | ignoreFields | The list of field names to be ignored. The default value is an empty list. | string[] | [] |
  | addFields | The list of field names to be added and the calculation method of their corresponding attribute values. The default is an empty list. | [{ fieldName: string;callback: (item) => any }] | [] |
  | needParentId | Whether the child node needs the id of the parent node. Default is true. | boolean | true |




### Return value

Returns an array containing information for all nodes, including their own information and the information of their descendant nodes.



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