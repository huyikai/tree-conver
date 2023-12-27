# 数组转树

将一个扁平的节点数组转换成树形结构。

## 参数

它接受两个参数：

- **Array**: 扁平的节点数组
- **Options**: 一个可选的参数对象，用于配置转换方法的具体行为

  | 参数        | 描述                         | 类型   | 默认值     |
  | ----------- | ---------------------------- | ------ | ---------- |
  | childrenKey | 自定义节点 children 字段名称 | string | 'children' |
  | idKey       | 自定义节点 ID 字段名称       | string | 'id'       |
  | pidKey      | 自定义节点父 ID 字段名称     | string | 'pid'      |

## 示例

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
