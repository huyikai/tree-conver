# Changelog

<!--
下一个发布版本号：0.1.0（0.x 阶段的 BREAKING CHANGES 走 minor bump）。
本区块由 release-it + conventional-changelog 在发布时归档。
-->

## [Unreleased] → 0.1.0

### ⚠ BREAKING CHANGES

- **`arrayToTree`** 现在对无效输入采取**确定性丢弃**策略，不再产生不可预测的运行时错误：
  - `undefined` / 非对象元素 → 静默丢弃
  - 缺失 `idKey` 字段（或值为 `null` / `undefined` / `''`） → 丢弃
  - 重复 `id` → 保留首次出现
  - `pid` 指向不存在的父节点 → 作为孤儿丢弃
  - 循环引用（A→B→A 或自引用）→ 环上节点全部作为孤儿丢弃，通过 `onOrphan` 上报
  - 不再产生 `console.warn` 副作用；通过新增的 `onDuplicate` / `onOrphan` 回调监听被丢弃的节点
  - `idKey`、`pidKey`、`childrenKey` 重复时**抛错**，避免数据损坏
  - `pidKey` 与默认 `'pid'` 一致时，`pid` 同样归一为 string，保证 `node.id === node.pid` 比较可靠；**自定义 key 时不注入合成的 `id`/`pid` 字段**，避免覆盖同名业务字段
  - 输入节点上预存的 `children` 字段会被忽略，子树完全由 pid 关系重建
- **`treeToArray`** 当父节点缺失 `idKey` 时，子节点的 `parentId` 由 `''`（空字符串）改为 `null`，与根节点语义保持一致。**注意**：调用方无法区分"根节点"与"父节点缺 id"两种情况，请使用 `node.parentId === null` 前确保业务允许这一模糊性。
- **`treeToArray`** 选项 `primaryKey` 重命名为 `idKey`，与 `arrayToTree` 保持一致。

### Features

- 新增 `onDuplicate(ids: string[])` 和 `onOrphan(nodes: ArrayNode[])` 回调，监听 `arrayToTree` 中被丢弃的节点。
- `generateTree` 改用确定性递增 id（挂载在函数对象上的闭包计数器），可通过 `__resetGeneratorCounter()` 重置（仅供测试）。

### Bug Fixes

- 修复 `treeToArray` 在父节点缺主键时 `parentId` 退化为空字符串导致下游判断错误的隐患。
- 修复 `arrayToTree` 在重复 id 时静默覆盖前一个节点的隐患（保留首次 + 报告）。
- 修复 `arrayToTree` 中**循环父子引用**导致的无限递归挂载——环上节点现在作为孤儿丢弃并通过 `onOrphan` 上报（memo 化链上追溯，链与环均为 O(n)）。
- 修复 `arrayToTree` 自定义 `idKey`/`pidKey` 时注入合成 `id`/`pid` 字段可能覆盖同名业务字段的隐患——合成字段仅在默认 key 时写回。
- 修复 `treeToArray` 在 `needParentId: false` 时误删用户自带 `parentId` 字段的隐患。
- 修复 `arrayToTree` 结果中 `id`（string）与 `pid`（可能为 number）类型不一致的问题——`pid` 同样 toString 归一。
- 修复 `treeToArray` 中 `{ ...node } + delete` 导致 V8 dictionary mode 退化的性能隐患——改为重建对象。
- 提取 `isEmptyValue` / `normalizeId` 到共享模块 `utils.ts`，保证 `arrayToTree` 与 `treeToArray` 的空值语义一致。
- 修复 `arrayToTree` 中输入节点上预存的 `children` 字段与 `pid` 重建逻辑冲突的隐患——现在完全按 `pid` 重建，丢弃预存 `children`，杜绝原数据与结果树的引用共享。
- 修复 `idKey` / `pidKey` / `childrenKey` 互相重叠时静默破坏数据的隐患——配置自检抛错。

### Documentation

- README / README-zhCN 中 `arrayToTree` 表格新增 `onDuplicate` / `onOrphan` 行，并补"丢弃节点的规则"小节。
- README / README-zhCN 中 `treeToArray` 补 caveat：父缺 id 时 `parentId=null` 与根节点不可区分。
- README / README-zhCN 中 `treeToArray` 的 `t2aOptions` 示例补齐 `idKey`，表格字段顺序调整。

### Tests

- 新增 Vitest 测试套件，33 用例覆盖核心函数 + 边界条件（含循环依赖、循环引用、原数据不可变、配置自检等）。

### Build / Infrastructure

- 升级 CI Node 矩阵：16/18/20 → 18/20/22（Node 16 已 EOL）。
- 同步 `engines.node` 到 `>=18`。
- 简化 CI 工作流：合并重复的 `npm ci` 步骤，并加注释提示启用 branch protection。

## 0.0.96 (2023-12-27)


### Features

* 🎸 new version ([0236f07](https://github.com/huyikai/tree-conver/commit/0236f070ade1dbb9062647b3dfdd8b46c22d2450))
