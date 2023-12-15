# treeToArray

Here are some examples of using the treeToArray method.

## 1. Using only the tree parameter, without providing the options parameter

```javascript
const tree = {
  id: '1',
  name: 'root',
  children: [
    {
      id: '2',
      name: 'child1'
    },
    {
      id: '3',
      name: 'child2',
      children: [
        {
          id: '4',
          name: 'grandchild'
        }
      ]
    }
  ]
};

// Call the treeToArray method, only providing the tree parameter
const nodes = treeToArray(tree);

console.log(nodes);
```

### Output

```json
[
  { id: '1', name: 'root' },
  { id: '2', name: 'child1', parentId: '1' },
  { id: '3', name: 'child2', parentId: '1' },
  { id: '4', name: 'grandchild', parentId: '3' }
]
```

## 2. Providing one or more options parameters

```JavaScript
const tree = {
  id: '1',
  name: 'root',
  children: [
    {
      id: '2',
      name: 'child1'
    },
    {
      id: '3',
      name: 'child2',
      children: [
        {
          id: '4',
          name: 'grandchild'
        }
      ]
    }
  ]
};

// Assign values to the options parameter
const options = {
  childrenKey: 'kids', // Replace the default 'children' key name with 'kids'
  ignoreFields: ['name'], // Ignore the 'name' field
  addFields: [
    {
      fieldName: 'hasChildren', // Add a new 'field' property with a boolean value
      callback: (node: Node) => Boolean(node['children'])
    }
  ],
  needParentId: false // Prevent adding parentId property to child nodes
};

// Call the treeToArray method, providing both tree and options parameters
const nodes = treeToArray(tree, options);

console.log(nodes);
```

### Output

```json
[
  { id: '1', kids: [] },
  { id: '2', kids: [], hasChildren: false },
  { id: '3', kids: [], hasChildren: true },
  { id: '4', kids: [], hasChildren: false }
]
```

## 3. Using a custom traversal function to calculate new property values:

```JavaScript
const tree = {
  id: '1',
  name: 'root',
  children: [
    {
      id: '2',
      name: 'child1'
    },
    {
      id: '3',
      name: 'child2',
      children: [
        {
          id: '4',
          name: 'grandchild'
        }
      ]
    }
  ]
};

// Define a custom traversal function to calculate the 'depth' property of each node
const calculateDepth = (node: Node) => {
  let depth = 0;
  let parent = node;
  while (parent) {
    depth++;
    parent = parent['parentId'] && tree.find((n) => n.id === parent['parentId']);
  }
  return depth;
};

// Assign values to the options parameter
const options = {
  addFields: [
    {
      fieldName: 'depth', // Add a new 'depth' property with the depth of each node
      callback: calculateDepth
    }
  ]
};

// Call the treeToArray method, providing both tree and options parameters
const nodes = treeToArray(tree, options);

console.log(nodes);
```

### Output

```json
[
  { id: '1', name: 'root', depth: 1 },
  { id: '2', name: 'child1', parentId: '1', depth: 2 },
  { id: '3', name: 'child2', parentId: '1', depth: 2 },
  { id: '4', name: 'grandchild', parentId: '3', depth: 3 }
]
```



