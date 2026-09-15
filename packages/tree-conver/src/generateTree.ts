interface Item {
  children?: Item[];
  id: string;
}

interface GenerateTreeOptions {
  /** 自定义 id 生成器；不传则使用内部递增计数器 */
  idGenerator?: () => string;
}

interface GeneratorContext {
  counter: number;
}

/**
 * 内部状态挂在函数对象上，避免模块级全局污染。
 * 用类型合并扩展让 `__ctx` 在严格模式下也能被访问。
 */
interface GenerateTreeFn {
  (depth: number, width: number, options?: GenerateTreeOptions): Item;
  __ctx?: GeneratorContext;
}

/**
 * 生成一棵测试树。默认 id 由挂载在函数对象上的闭包计数器生成，
 * 避免模块级状态污染全局作用域；多 worker / SSR 场景下也彼此隔离。
 *
 * @param depth 树的层级深度（depth=0 表示只有根节点）
 * @param width 每个父节点的子节点数量
 * @param options 可选 id 生成器
 * @returns 生成的树根节点
 */
export const generateTree: GenerateTreeFn = (
  depth: number,
  width: number,
  options: GenerateTreeOptions = {}
): Item => {
  const idGenerator =
    options.idGenerator ||
    (() => {
      const ctx: GeneratorContext =
        generateTree.__ctx || (generateTree.__ctx = { counter: 0 });
      return () => `${++ctx.counter}`;
    })();

  const build = (d: number): Item => {
    const node: Item = { id: idGenerator() };
    if (d > 0) {
      node.children = [];
      for (let i = 0; i < width; i++) {
        node.children.push(build(d - 1));
      }
    }
    return node;
  };

  return build(depth);
};

/**
 * 重置默认计数器的内部上下文。仅供测试使用。
 * @internal
 */
export const __resetGeneratorCounter = (): void => {
  if (generateTree.__ctx) {
    generateTree.__ctx.counter = 0;
  }
};
