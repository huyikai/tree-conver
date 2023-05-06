interface Node {
  id: string; // 节点的唯一标识符
  children?: Array<Node>; // 节点的子节点数组
  pid?: string; // 节点的父节点标识符
}
interface Options {
  idKey?: string; // 自定义 id 字段的名称
  pidKey?: string; // 自定义 pid 字段的名称
  childrenKey?: string; // 自定义 children 字段的名称
}

export const arrayToTree = (array: Array<Node>, options: Options = {}) => {
  // 解构 options 对象来获取自定义字段名称或默认值
  const { idKey = 'id', pidKey = 'pid', childrenKey = 'children' } = options;
  // 创建节点 id 到节点的映射
  const map = array.reduce((acc: Record<string, Node>, node: any) => {
    acc[node[idKey]] = { ...node, [childrenKey]: [] }; // 初始化节点并添加到映射中
    return acc;
  }, {});

  Object.values(map).forEach((node: any) => {
    // 遍历所有节点
    const parentId = node[pidKey];
    if (parentId) {
      // 如果存在父节点
      const parent: any = map[parentId]; // 获取当前节点的父节点
      if (!parent[childrenKey]) {
        // 如果父节点没有 children 属性
        parent[childrenKey] = []; // 初始化 children 属性
      }
      parent[childrenKey].push(node); // 将当前节点添加到父节点的 children 数组中
    }
  });

  // 找到所有根节点（没有父节点的节点）并构建树
  const tree = Object.values(map).filter((node: any) => !node[pidKey]);

  return tree;
};
