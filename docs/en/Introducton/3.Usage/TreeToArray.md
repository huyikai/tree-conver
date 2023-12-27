# Tree to Array

Converts a tree structure array into a flat array.

## Parameters

It takes two parameters:

- **Tree**: Tree structure array

- **Options**: An optional parameter object used to configure the specific behavior of the conversion method

  | Property     | Description                                                                                | Type                                            | Default    |
  | ------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------- | ---------- |
  | addFields    | List of field names to be added and their corresponding property value calculation methods | [{ fieldName: string;callback: (item) => any }] | []         |
  | childrenKey  | Key name for child nodes                                                                   | string                                          | 'children' |
  | ignoreFields | List of field names to be ignored                                                          | string[]                                        | []         |
  | needParentId | Whether to add the parent node ID to the node information                                  | boolean                                         | true       |

## Example

```javascript
const treeArray = [
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
const calculateDepth = (node) => {
  let depth = 0;
  let parent = node;
  while (parent) {
    depth++;
    parent =
      parent['parentId'] && treeArray.find((n) => n.id === parent['parentId']);
  }
  return depth;
};
const options = {
  childrenKey: 'list',
  ignoreFields: [],
  addFields: [
    {
      fieldName: 'hasChildren', // Add a new 'field' property with a boolean value
      callback: (node) => Boolean(node['children'])
    },
    {
      fieldName: 'depth', // Add a new 'depth' property with the depth of each node
      callback: calculateDepth
    }
  ],
  needParentId: true
};

const flatArray = treeToArray(treeArray, options);

console.log(flatArray);
```

<script setup lang='ts'>
  import { flatArray }from "@/.vitepress/theme/components/CustomExample"
</script>

{{JSON.stringify(flatArray, null, 2)}}
