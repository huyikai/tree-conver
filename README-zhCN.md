
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

  | 参数        | 说明                           | 类型   | 默认值     |
  | ----------- | ------------------------------ | ------ | ---------- |
  | childrenKey | 自定义节点 children 字段的名称 | string | 'children' |
  | idKey       | 自定义节点 id 字段的名称       | string | 'id'       |
  | pidKey      | 自定义节点 pid 字段的名称      | string | 'pid'      |


### 返回值

返回一个树形结构的节点数组。

### 复杂度

- **时间复杂度**

  该方法的时间复杂度为 O(n)，其中 n 为输入数组的长度。在方法中，遍历了输入数组并创建了节点 id 到节点的映射，这一步的时间复杂度为 O(n)。接下来，又遍历了一遍所有节点，将它们添加到它们的父节点的 children 数组中，这一步的时间复杂度同样为 O(n)。因此，总的时间复杂度为 O(n)。

- **空间复杂度**

  该方法的空间复杂度为 O(n)，其中 n 为 array 数组的长度。在方法中，通过遍历 array 数组来创建节点 id 到节点的映射，并在映射中存储所有节点，因此，空间复杂度为 O(n)。然后，对该映射中的所有节点进行一次遍历，将它们的子节点添加到 parentNode 的 children 属性中，也是 O(n) 的空间复杂度。综上所述，
