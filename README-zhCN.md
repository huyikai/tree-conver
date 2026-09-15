
# Tree-Conver

树形数据转换工具

## 使用方法

```shell
npm i tree-conver
```

```javascript
// 导入默认导出
import treeToArray from "tree-conver"
// 或者导入解构导出
import { treeToArray, arrayToTree } from "tree-conver"

// 定义扁平节点数组
// 根节点的 pid 应该为 null 或 ''，要处理的数据应该至少有一个具有 null pid 的项
const myArray = [
  { uid: '1', name: '节点 1', pid: null },
  { uid: '2', name: '节点 2', pid: '1' },
  { uid: '3', name: '节点 3', pid: '1' },
  { uid: '4', name: '节点 4', pid: '2' },
  { uid: '5', name: '节点 5', pid: '2' },
  { uid: '6', name: '节点 6', pid: '3' },
];

// 设置选项，可以为空，或仅设置所需的项目
const a2tOptions = {
  idKey: 'uid', // 自定义 id 字段，默认为 'id'
  pidKey: 'pid', // 自定义 pid 字段，默认为 'pid'
  childrenKey: 'children' // 自定义 children 字段，默认为 'children'
}

// 调用 arrayToTree 方法并传入设置的参数以将扁平节点数组转换为树形结构。
const myTree = arrayToTree(myArray, a2tOptions);

/**================================================================*/

// 定义树形结构
const myTree = [
  {
    id: '1',
    name: '节点 1',
    list: [
      {
        id: '2',
        name: '节点 2',
        list: [
          {
            id: '3',
            name: '节点 3'
          }
        ]
      },
      {
        id: '4',
        name: '节点 4'
      }
    ]
  }
];

// 设置选项，可以为空，或仅设置所需的项目
const t2aOptions = {
  idKey: 'id', // 节点id字段的名称。默认为 'id'
  childrenKey: 'list', // 子节点的键名。默认为 'children'
  ignoreFields: [], // 要忽略的字段名列表。默认值为空列表。
  addFields: [], // 要添加的字段名列表及其对应属性值的计算方法。默认为空列表。
  needParentId: true // 子节点是否需要父节点的 id。默认为 true。
}

// 调用 treeToArray 方法并传入设置的参数以将树形结构转换为数组
const nodes = treeToArray(tree, t2aOptions);
```

[查看更多使用示例](https://huyikai.github.io/tree-conver/contents/Example/arrayToTree.html)

## arrayToTree

将扁平节点数组转化为树形结构的方法。

该方法的实现思路是先将给定的节点数组转化为一个以节点id为key的映射，然后遍历每个节点，找到它的父节点并将它添加到父节点的children属性中。最后，从根节点开始构建整个树并返回树形结构数据。

### 参数

它接受两个参数：

- **Array** : 扁平节点数组 

- **Options** : 一个可选参数对象，用来配置转换方法的具体行为

  | 参数        | 说明                              | 类型                            | 默认值     |
  | ----------- | --------------------------------- | ------------------------------- | ---------- |
  | childrenKey | 自定义节点 children 字段的名称    | string                          | 'children' |
  | idKey       | 自定义节点 id 字段的名称          | string                          | 'id'       |
  | pidKey      | 自定义节点 pid 字段的名称         | string                          | 'pid'      |
  | onDuplicate | 重复 id 时触发，传入所有重复 id    | `(ids: string[]) => void`       | undefined  |
  | onOrphan    | 节点被丢弃时触发，传入所有被丢弃的节点 | `(nodes: ArrayNode[]) => void`  | undefined  |

### 丢弃节点的规则

`arrayToTree` 默认是**纯函数**——不会向 `console` 输出任何内容。需要监听被丢弃的节点时，通过 `onDuplicate` 和 `onOrphan` 回调：

```js
import { arrayToTree } from 'tree-conver';

const tree = arrayToTree(input, {
  onDuplicate: (ids) => console.warn('重复 id:', ids),
  onOrphan:    (nodes) => console.warn('孤儿节点:', nodes)
});
```

以下情况节点会被丢弃：

- 元素为 `null` / `undefined` / 非对象；
- `idKey` 字段缺失、为 `null` 或空字符串；
- `id` 在数组中已出现过（保留首次出现）；
- `pidKey` 的值在之前的节点中找不到匹配的 `id`；
- 节点处于循环父子链上（如 `A→B→A` 或自引用 `A→A`）——整个环都会被丢弃并通过 `onOrphan` 上报。

如果 `idKey`、`pidKey`、`childrenKey` 三个字段重复（即指向同一个属性），`arrayToTree` 会抛错——这种错误配置会静默破坏数据，必须显式失败。

结果中的 `id` 与 `pid` 仅在使用默认字段名（`idKey='id'`、`pidKey='pid'`）时才归一为 **string**，因此 `node.id === node.pid` 比较总是可靠的。使用自定义字段名时，节点按原样返回（不注入合成的 `id` / `pid` 字段）。输入节点上预存的 `children` 字段会被忽略——树完全由 `pid` 关系重建。

> **注意**：`onOrphan` 回调拿到的是原始输入对象的引用，请勿在回调中原地修改。

### 返回值

返回一个树形结构的节点数组。

### 复杂度

- **时间复杂度**

  该方法的时间复杂度为 O(n)，其中 n 是输入数组的长度。在该方法中，输入数组被遍历并创建了一个节点 id 到节点的映射，这需要 O(n) 的时间。然后，所有节点再次被遍历，并添加到其父节点的 children 数组中，这也需要 O(n) 的时间。因此，总时间复杂度为 O(n)。

- **空间复杂度**

  该方法的空间复杂度为 O(n)，其中 n 是数组的长度。在该方法中，通过遍历数组创建了一个节点 id 到节点的映射，并将所有节点存储在映射中，因此空间复杂度为 O(n)。然后，再次遍历映射中的所有节点，并将其子节点添加到 parentNode 的 children 属性中，这也具有 O(n) 的空间复杂度。因此，arrayToTree 方法的空间复杂度为 O(n)。


## treeToArray

这是一个将树形结构数据转换为扁平化数组的方法。

该方法的实现基于二叉树的广度优先遍历。对于每个遍历到的节点，会进行一系列的操作，例如将节点的所有属性存储在一个新的节点对象中，删除忽略的属性，计算并添加所需的属性。在这些操作之后，节点以新的形式保存在一个数组中，并返回包含数组中所有节点信息（包括后代节点）的结果。

### 参数

该方法有两个参数：

- **Tree**：包含所有节点的树形结构

- **Options**：一个可选的对象，用于配置转换方法的行为

  | 属性        | 描述                                       | 类型          | 默认值      |
  | ----------- | ------------------------------------------ | ------------- | ----------- |
  | idKey       | 节点id字段的名称                           | string        | 'id'       |
  | childrenKey | 子节点字段的名称                           | string        | 'children' |
  | ignoreFields | 要忽略的字段名称列表。默认值为空列表。 | string[] | [] |
  | addFields | 要添加的字段名称列表和它们对应的属性值计算方法。默认为空列表。 | [{ fieldName: string;callback: (item) => any }] | [] |
  | needParentId | 子节点是否需要父节点的id。默认为true。 | boolean | true |

### 返回值

返回一个包含所有节点信息的数组，包括它们自己的信息和它们的后代节点的信息。

> **注意**：当某个父节点缺失 `idKey` 字段时，其后代节点的 `parentId` 会等于 `null`，与根节点相同。调用方无法区分"真正的根"与"父节点缺 id"两种情况，如需区分请在传入前补齐 id。

### 复杂度

- 时间复杂度

  该方法的时间复杂度取决于树的深度和节点数量。在最坏情况下，如果树是平衡树且每个节点都有多个子节点，则时间复杂度为O(nlogn)。在树的高度较小的情况下，即使每个节点都有多个子节点，时间复杂度仍然为O(n)，其中n是节点数。该方法使用栈实现迭代，以减少内存使用和嵌套调用栈。因此，在大多数情况下，该方法可以高效地实现。

- 空间复杂度

  该方法的空间复杂度为O(n)，其中n是树中的节点数。因为该方法的实现不使用递归，而是使用迭代实现具有堆栈的深度优先遍历。存储在堆栈中的节点数组的最大长度是树的深度，因此空间复杂度为O(n)。

## 网站

[huyikai.github.io/tree-conver/](https://huyikai.github.io/tree-conver/)

## 代码库

https://github.com/huyikai/tree-conver.git

## 许可证

[MIT](./license)