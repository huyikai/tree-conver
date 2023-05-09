# treeToArray

以下是几种使用treeToArray方法的示例

## 1. 只使用tree入参，不提供options参数

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

// 调用treeToArray方法，只提供tree参数
const nodes = treeToArray(tree);

console.log(nodes);
```

### 输出结果

```json
[
  { id: '1', name: 'root' },
  { id: '2', name: 'child1', parentId: '1' },
  { id: '3', name: 'child2', parentId: '1' },
  { id: '4', name: 'grandchild', parentId: '3' }
]
```

## 2. 提供一个或多个options参数

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

// 为options参数赋值
const options = {
  childrenKey: 'kids', // 将默认的'children'键名称替换为'kids'
  ignoreFields: ['name'], // 忽略'name'字段
  addFields: [
    {
      fieldName: 'hasChildren', // 新增一个'field'属性，值为布尔值
      callback: (node: Node) => Boolean(node['children'])
    }
  ],
  needParentId: false // 禁止为子节点添加parentId属性
};

// 调用treeToArray方法，提供tree和options参数
const nodes = treeToArray(tree, options);

console.log(nodes);
```

### 输出结果

```json
[
  { id: '1', kids: [] },
  { id: '2', kids: [], hasChildren: false },
  { id: '3', kids: [], hasChildren: true },
  { id: '4', kids: [], hasChildren: false }
]
```

## 3. 使用自定义的遍历函数计算新的属性值：

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

// 自定义一个遍历函数，用于计算节点的'depth'属性
const calculateDepth = (node: Node) => {
  let depth = 0;
  let parent = node;
  while (parent) {
    depth++;
    parent = parent['parentId'] && tree.find((n) => n.id === parent['parentId']);
  }
  return depth;
};

// 为options参数赋值
const options = {
  addFields: [
    {
      fieldName: 'depth', // 新增一个'depth'属性，值为每个节点的深度
      callback: calculateDepth
    }
  ]
};

// 调用treeToArray方法，提供tree和options参数
const nodes = treeToArray(tree, options);

console.log(nodes);
```

### 输出结果

```json
[
  { id: '1', name: 'root', depth: 1 },
  { id: '2', name: 'child1', parentId: '1', depth: 2 },
  { id: '3', name: 'child2', parentId: '1', depth: 2 },
  { id: '4', name: 'grandchild', parentId: '3', depth: 3 }
]
```

