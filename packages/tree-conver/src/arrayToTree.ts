import { normalizeId } from './utils';

/**
 * 入参节点形状——宽类型，允许业务方携带任意附加字段。
 */
interface ArrayNode {
  id?: string | number | null;
  pid?: string | number | null;
  children?: Array<ArrayNode>;
  [key: string]: any;
}

/**
 * 树节点——id 统一为 string。
 * 注意：当用户使用默认 key 时，pid 同样归一为 string，
 * 以保证 `node.id === node.pid` 这类比较的安全。
 */
interface TreeNode {
  id: string;
  pid?: string | null;
  children: TreeNode[];
  [key: string]: any;
}

interface Options {
  /** id 字段名，默认 'id' */
  idKey?: string;
  /** 父 id 字段名，默认 'pid' */
  pidKey?: string;
  /** children 字段名，默认 'children' */
  childrenKey?: string;
  /**
   * 当检测到重复 id 时的回调。传入所有重复 id 列表。
   * 默认不输出任何警告——库保持纯函数行为。
   */
  onDuplicate?: (duplicateIds: string[]) => void;
  /**
   * 当检测到节点被丢弃时的回调，传入所有被丢弃的节点。
   * 丢弃原因包括：缺 id、找不到父节点、陷入循环引用。
   * 注意：回调拿到的是原始输入对象的引用，请勿原地修改。
   */
  onOrphan?: (orphanNodes: ArrayNode[]) => void;
}

/**
 * 循环引用检测：带 memo 的链上追溯，整体 O(n)。
 * - cyclic：已确认处于环上的节点 id（检测到环时整条路径记入）
 * - safe：已确认可以到达根节点的节点 id
 * @returns 节点 id 是否陷入循环引用
 */
const isCyclicFrom = (
  startId: string,
  map: Map<string, TreeNode>,
  pidOf: Map<string, string | null>,
  cyclic: Set<string>,
  safe: Set<string>
): boolean => {
  const path: string[] = [];
  const onPath = new Set<string>();
  let cursor: string | undefined = startId;
  while (cursor !== undefined) {
    if (cyclic.has(cursor)) return true;
    if (safe.has(cursor)) break;
    const pid: string | null = pidOf.get(cursor) ?? null;
    if (pid === null) break; // 到达根
    if (onPath.has(pid)) {
      // 检测到环：整条路径上的节点都是环的一部分
      cyclic.add(pid);
      path.forEach((id) => cyclic.add(id));
      return true;
    }
    onPath.add(cursor);
    path.push(cursor);
    cursor = map.has(pid) ? pid : undefined;
  }
  // 走到根或已验证安全的节点：整条链都安全
  path.forEach((id) => safe.add(id));
  return false;
};

/**
 * 将扁平节点数组转换为树形结构。
 *
 * 默认行为（确定性、纯函数，无 console 输出）：
 * - `undefined` / 非对象元素 → 跳过
 * - 缺失 id（`undefined` / `null` / `''`）→ 丢弃
 * - 重复 id → 保留首次出现
 * - pid 指向不存在的父节点 → 丢弃
 * - 循环引用（A→B→A 或自引用）→ 整个环上的节点全部丢弃
 * - 输入节点上预存的 children 字段 → 忽略，子树完全由 pid 重建
 *
 * 通过 `onDuplicate` / `onOrphan` 回调可监听被丢弃的节点。
 *
 * 合成字段策略：只有当用户使用默认 key（idKey='id' / pidKey='pid'）时，
 * 归一后的 string 值才写回同名字段；自定义 key 时不注入 `id` / `pid`，
 * 避免覆盖节点上恰好同名的业务字段。
 *
 * @param array 扁平节点数组
 * @param options 配置项
 * @returns 树根节点数组
 */
/**
 * 第一遍：建索引（归一 id / pid 存在独立映射表中，不污染节点对象）。
 * 同时收集重复 id 与被丢弃的节点。
 */
const buildIndex = (
  array: Array<ArrayNode>,
  idKey: string,
  pidKey: string,
  childrenKey: string,
  writeIdField: boolean,
  writePidField: boolean,
  duplicates: string[],
  orphans: ArrayNode[]
): { map: Map<string, TreeNode>; pidOf: Map<string, string | null> } => {
  const map = new Map<string, TreeNode>();
  // id → 归一后的 pid（string | null，null 表示根）
  const pidOf = new Map<string, string | null>();

  for (const node of array) {
    if (!node || typeof node !== 'object') continue;
    const id = normalizeId(node[idKey]);
    if (id === undefined) {
      orphans.push(node);
      continue;
    }
    if (map.has(id)) {
      duplicates.push(id);
      continue;
    }
    // 不保留输入节点上预存的 children——避免与"按 pid 重建"产生冲突，
    // 同时杜绝浅拷贝导致的原数据与结果树共享引用。子树完全由 pid 关系生成。
    const clone: TreeNode = { ...node, [childrenKey]: [] } as TreeNode;
    if (writeIdField) clone.id = id;
    const pid = normalizeId(node[pidKey]) ?? null;
    if (writePidField) clone.pid = pid;
    map.set(id, clone);
    pidOf.set(id, pid);
  }
  return { map, pidOf };
};

export const arrayToTree = (
  array: Array<ArrayNode>,
  options: Options = {}
): TreeNode[] => {
  if (!Array.isArray(array)) {
    throw new Error('The first argument must be an array.');
  }
  const {
    idKey = 'id',
    pidKey = 'pid',
    childrenKey = 'children',
    onDuplicate,
    onOrphan
  } = options;

  // 配置自检：相同的 key 容易导致数据损坏
  if (idKey === pidKey || idKey === childrenKey || pidKey === childrenKey) {
    throw new Error(
      `[arrayToTree] idKey, pidKey and childrenKey must be distinct (got ${JSON.stringify(
        {
          idKey,
          pidKey,
          childrenKey
        }
      )})`
    );
  }

  // 归一值是否写回 'id' / 'pid' 同名字段：
  // 仅当用户 key 与默认 key 相同时才写，防止覆盖业务字段
  const writeIdField = idKey === 'id';
  const writePidField = pidKey === 'pid';

  // 第一遍：建索引，并收集重复 / 缺 id 的元素
  const duplicates: string[] = [];
  const orphans: ArrayNode[] = [];
  const { map, pidOf } = buildIndex(
    array,
    idKey,
    pidKey,
    childrenKey,
    writeIdField,
    writePidField,
    duplicates,
    orphans
  );

  // 循环引用检测的 memo 集合，由模块级 isCyclicFrom 维护
  const cyclic = new Set<string>();
  const safe = new Set<string>();

  // 第二遍：把每个节点挂到父节点的 children 上
  map.forEach((node, id) => {
    const pid = pidOf.get(id)!;
    if (pid === null) return; // 根节点
    const parent = map.get(pid);
    if (!parent || isCyclicFrom(id, map, pidOf, cyclic, safe)) {
      // 找不到父，或陷入循环引用——丢弃
      orphans.push(node);
      return;
    }
    parent[childrenKey].push(node);
  });

  // 通过回调报告被丢弃的节点，由用户决定是否输出
  if (duplicates.length && onDuplicate) onDuplicate(duplicates);
  if (orphans.length && onOrphan) onOrphan(orphans);

  // 第三遍：返回所有根节点
  return Array.from(map.entries())
    .filter(([id]) => pidOf.get(id) === null)
    .map(([, node]) => node);
};
