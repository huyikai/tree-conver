// 节点类型 Node Type
interface Node {
  [key: string]: any;
  children?: Array<Node>;
}

// 入参类型
interface TreeToArrayOptions {
  // 子节点的键名称，默认为'children'
  childrenKey?: string;
  // 需要忽略的字段名列表，默认为空列表
  ignoreFields?: Array<string>;
  // 需要添加的字段名及其对应属性值的计算方式列表，默认为空列表
  addFields?: Array<{ fieldName: string; callback: (item: Node) => any }>;
  // 子节点是否需要父节点的id，默认为true
  needParentId?: boolean;
}

// 根据树状结构以数组形式返回所有节点（包括子孙节点）
export const treeToArray = (
  tree: Array<Node>,
  options: TreeToArrayOptions = {}
): Array<Node> => {
  const {
    // 子节点的键名称
    childrenKey = 'children',
    // 要忽略的字段名列表
    ignoreFields = [],
    // 需要添加的字段名及其对应属性值的计算方式列表
    addFields = [],
    // 子节点是否需要父节点的id，默认为true
    needParentId = true
  } = options;
  const nodes: Array<Node> = [];
  // stack用于迭代树结构中的子节点和子孙子节点
  const stack: Array<{
    // 正在处理的节点，包括该节点的信息、父节点的id、以及该节点的所有子节点
    node: Node | null;
    children: Array<Node>;
    parentId: string | null;
  }> = [];
  // 将整个树的所有节点压入栈，其中root节点的parentId为空
  stack.push({
    node: null,
    children: tree,
    parentId: null
  });
  while (stack.length) {
    const { node, children, parentId } = stack.pop()!;
    if (node) {
      // 存储该节点的所有属性到newNode中，除去childrenKey所指定的子节点信息
      const { [childrenKey]: subChildren, ...rest } = node;
      const newNode = { ...rest };
      if (needParentId) {
        // 如果needParentId为true，则将父节点的id添加到该节点的属性中
        newNode['parentId'] = parentId;
      }
      if (addFields.length) {
        // 如果需要添加属性值，则遍历addFields列表，计算对应的属性值
        for (let i = 0; i < addFields.length; i++) {
          newNode[addFields[i].fieldName] = addFields[i].callback(node);
        }
      }
      if (ignoreFields.length) {
        // 如果需要忽略某些属性，则遍历ignoreFields列表，将对应的属性从newNode中删除
        for (let i = 0; i < ignoreFields.length; i++) {
          delete newNode[ignoreFields[i]];
        }
      }
      // 将newNode存入nodes数组中
      nodes.push(newNode);
    }
    if (children) {
      // 将该节点的所有子节点压入栈中，继续循环直到stack为空
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push({
          node: children[i],
          children: children[i][childrenKey] || [],
          parentId: node?.id || ''
        });
      }
    }
  }
  // 返回以数组形式储存的所有节点（包括子孙节点）
  return nodes;
};
