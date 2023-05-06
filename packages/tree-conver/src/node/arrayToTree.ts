interface Node {
  id: string; // 节点的唯一标识符
  name: string; // 节点的名字
  children?: Array<Node>; // 节点的子节点数组
  pid?: string; // 节点的父节点标识符
}
export const arrayToTree = (array: Array<Node>) => {
  const map = array.reduce((acc: Record<string, Node>, node) => {
    // 构建节点id到节点的映射
    acc[node.id] = { ...node, children: [] }; // 将当前节点加入映射中
    return acc;
  }, {});

  Object.values(map).forEach((node) => {
    // 遍历所有节点
    const parent = node.pid !== undefined ? map[node.pid] : undefined; // 找到当前节点的父节点
    if (parent) {
      // 如果存在父节点
      if (!parent.children) {
        // 如果父节点没有children属性
        parent.children = []; // 则初始化children属性为一个数组
      }
      parent.children.push(node); // 将当前节点加入父节点的children数组中
    }
  });

  // 找到所有根节点（没有父节点的节点）并构建树
  const tree = Object.values(map).filter((node) => !node.pid);

  return tree;
};
