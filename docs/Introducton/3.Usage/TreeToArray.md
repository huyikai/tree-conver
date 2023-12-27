# 树转数组

将树形结构的数据转换为扁平的数组。

## 参数

接受两个参数：

- **Tree**: 树形结构数组

- **Options**: 一个可选的参数对象，用于配置转换方法的具体行为

  | 属性         | 描述                                             | 类型                                            | 默认值     |
  | ------------ | ------------------------------------------------ | ----------------------------------------------- | ---------- |
  | addFields    | 需要添加的字段名称及其对应的属性值计算方法的列表 | [{ fieldName: string;callback: (item) => any }] | []         |
  | childrenKey  | 子节点的键名                                     | string                                          | 'children' |
  | ignoreFields | 要忽略的字段名称列表                             | string[]                                        | []         |
  | needParentId | 是否添加节点信息的父节点 ID                      | boolean                                         | true       |

## 示例

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
