# Array to Tree

Converts a flat node array into a tree structure.

## Parameters

It takes two parameters:

- **Array**: Flat node array
- **Options**: An optional parameter object used to configure the specific behavior of the conversion method

  | Parameter   | Description                      | Type   | Default    |
  | ----------- | -------------------------------- | ------ | ---------- |
  | childrenKey | Custom node children field name  | string | 'children' |
  | idKey       | Custom node ID field name        | string | 'id'       |
  | pidKey      | Custom node parent ID field name | string | 'pid'      |

## Example

```javascript
const flatArray = [
  { uid: '1', name: 'node1', pid: null },
  { uid: '2', name: 'node2', pid: '1' },
  { uid: '3', name: 'node3', pid: '1' },
  { uid: '4', name: 'node4', pid: '2' },
  { uid: '5', name: 'node5', pid: '2' },
  { uid: '6', name: 'node6', pid: '3' }
];

const options = {
  idKey: 'id',
  pidKey: 'pid',
  childrenKey: 'children'
};

const treeArray = arrayToTree(flatArray, options);
```
