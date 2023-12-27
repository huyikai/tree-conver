import { treeToArray } from 'tree-conver';
export const treeArray = [
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
export const options = {
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

export const flatArray = treeToArray(treeArray, options);
