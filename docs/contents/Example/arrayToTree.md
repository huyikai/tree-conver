# arrayToTree

以下是几种使用arrayToTree方法的示例

## 1. 仅传入数组参数，使用默认的字段名称转换

```JavaScript
const array = [
  { id: '1', pid: '0' },
  { id: '2', pid: '1' },
  { id: '3', pid: '1' },
  { id: '4', pid: '2' }
];

const tree = arrayToTree(array);
console.log(tree);
```

### 输出结果

```json
[
  {
    "id": "1",
    "pid": "0",
    "children": [
      {
        "id": "2",
        "pid": "1",
        "children": [
          {
            "id": "4",
            "pid": "2",
            "children": []
          }
        ]
      },
      {
        "id": "3",
        "pid": "1",
        "children": []
      }
    ]
  }
]
```

## 2. 自定义字段名称

```JavaScript
const array = [
  { no: '1', parentNo: '0' },
  { no: '2', parentNo: '1' },
  { no: '3', parentNo: '1' },
  { no: '4', parentNo: '2' }
];

const options = {
  idKey: 'no',
  pidKey: 'parentNo',
  childrenKey: 'nodes'
};

const tree = arrayToTree(array, options);
console.log(tree);
```

### 输出结果

```json
[
  {
    "no": "1",
    "parentNo": "0",
    "nodes": [
      {
        "no": "2",
        "parentNo": "1",
        "nodes": [
          {
            "no": "4",
            "parentNo": "2",
            "nodes": []
          }
        ]
      },
      {
        "no": "3",
        "parentNo": "1",
        "nodes": []
      }
    ]
  }
]
```

## 3. 仅使用自定义的 id 字段名称

```JavaScript
const array = [
  { uid: '1', pid: '0' },
  { uid: '2', pid: '1' },
  { uid: '3', pid: '1' },
  { uid: '4', pid: '2' }
];

const options = {
  idKey: 'uid'
};

const tree = arrayToTree(array, options);
console.log(tree);
```

### 输出结果

```json
[
  {
    "uid": "1",
    "pid": "0",
    "children": [
      {
        "uid": "2",
        "pid": "1",
        "children": [
          {
            "uid": "4",
            "pid": "2",
            "children": []
          }
        ]
      },
      {
        "uid": "3",
        "pid": "1",
        "children": []
      }
    ]
  }
]
```

