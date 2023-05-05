export const treeToArray = (tree: Array<Node>): Array<Node> => {
  return tree.reduce((res: any, item: any) => {
    const { children, ...i } = item;
    // 解构item对象，得到children和除了children外的其他属性，将其他属性赋值给变量i
    return res.concat(
      i, // 保存i中的其他属性
      children && children.length ? treeToArray(children) : [] // 递归调用treeToArray函数，拼接子树的结果
    );
  }, []);
};
