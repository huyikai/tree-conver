import { isEmptyValue } from './utils';

/**
 * 树节点——允许业务方携带任意附加字段（用索引签名表达）。
 */
interface Node {
  children?: Node[];
  [key: string]: any;
}

interface TreeToArrayOptions {
  /** 主键字段名，默认 'id' */ idKey?: string;
  /** 子节点字段名，默认 'children' */
  childrenKey?: string;
  /** 需要忽略的字段名列表 */
  ignoreFields?: string[];
  /** 需要动态添加的字段及其计算方法 */
  addFields?: Array<{ fieldName: string; callback: (item: Node) => any }>;
  /** 是否在每个节点上附带 parentId，默认 true */
  needParentId?: boolean;
}

/**
 * 将树形结构扁平化为节点数组，使用栈迭代避免深递归爆栈。
 *
 * 注意：当父节点缺失 `idKey` 时，其子节点的 `parentId` 与根节点一样为 `null`，
 * 调用方无法区分这两种情况。如业务有此需求，请在传入前补齐 id。
 *
 * @param tree 树根节点数组
 * @param options 配置项
 * @returns 扁平化后的节点数组
 */
export const treeToArray = (
  tree: Array<Node>,
  options: TreeToArrayOptions = {}
): Array<Node> => {
  if (!Array.isArray(tree)) {
    throw new Error('The first argument must be an array.');
  }
  const {
    idKey = 'id',
    childrenKey = 'children',
    ignoreFields = [],
    addFields = [],
    needParentId = true
  } = options;

  // 配置自检：相同的 key 在树遍历中含义不同，重叠会导致数据错乱
  if (idKey === childrenKey) {
    throw new Error(
      `[treeToArray] idKey and childrenKey must be distinct (got ${JSON.stringify(
        { idKey, childrenKey }
      )})`
    );
  }

  const nodes: Node[] = [];
  // stack 用于深度优先遍历，根节点的 parentId 为 null
  const stack: Array<{
    node: Node | null;
    children: Node[];
    parentId: string | null;
  }> = [{ node: null, children: tree, parentId: null }];

  while (stack.length) {
    const { node, children, parentId } = stack.pop()!;
    if (node) {
      // 重建对象而非 { ...node } + delete：
      // 避免 V8 将对象降级为 dictionary mode 影响性能。
      // 仅在 needParentId 时跳过用户自带的 parentId，
      // 避免即将写入的合成值与原值冲突；needParentId=false 时保留原字段。
      const skipKeys = needParentId ? [childrenKey, 'parentId'] : [childrenKey];
      const newNode: Node = {};
      for (const key in node) {
        if (!skipKeys.includes(key)) {
          newNode[key] = node[key];
        }
      }
      if (needParentId) {
        newNode.parentId = parentId;
      }
      addFields.forEach(({ fieldName, callback }) => {
        newNode[fieldName] = callback(node);
      });
      ignoreFields.forEach((field) => {
        if (field !== childrenKey) {
          delete newNode[field];
        }
      });
      nodes.push(newNode);
    }
    if (children && children.length) {
      // 反向压栈以保证遍历顺序与原树一致（深度优先）
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        // 缺失 id（undefined / null / ''）时 parentId 归一为 null，
        // 与 arrayToTree 共用 isEmptyValue 保证语义一致——
        // 调用方无法区分"根"与"父缺 id"，参见 README。
        const parentId = node
          ? isEmptyValue(node[idKey])
            ? null
            : String(node[idKey])
          : null;
        stack.push({
          node: child,
          children: child[childrenKey] ?? [],
          parentId
        });
      }
    }
  }
  return nodes;
};
