import { describe, expect, it, vi } from 'vitest';
import { arrayToTree } from '../arrayToTree';

describe('arrayToTree', () => {
  it('converts a flat array into a tree using default keys', () => {
    const input = [
      { id: '1', name: 'root', pid: null },
      { id: '2', name: 'child-1', pid: '1' },
      { id: '3', name: 'child-2', pid: '1' },
      { id: '4', name: 'grandchild', pid: '2' }
    ];
    const tree = arrayToTree(input);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('1');
    expect(tree[0].children).toHaveLength(2);
    expect(tree[0].children!.find((c) => c.id === '2')!.children).toHaveLength(
      1
    );
  });

  it('supports custom idKey / pidKey / childrenKey', () => {
    const input = [
      { uid: 'a', pid: '' },
      { uid: 'b', pid: 'a' },
      { uid: 'c', pid: 'a' }
    ];
    const tree = arrayToTree(input, {
      idKey: 'uid',
      pidKey: 'pid',
      childrenKey: 'kids'
    });
    expect(tree).toHaveLength(1);
    expect(tree[0].kids).toHaveLength(2);
  });

  it('returns an empty array for an empty input', () => {
    expect(arrayToTree([])).toEqual([]);
  });

  it('throws if the first argument is not an array', () => {
    // @ts-expect-error 测试非法入参
    expect(() => arrayToTree('not-array')).toThrow('must be an array');
  });

  it('skips entries that are not plain objects', () => {
    const input = [null, undefined, 'string', 123, { id: '1', pid: null }];
    const tree = arrayToTree(input as any);
    expect(tree).toHaveLength(1);
  });

  it('keeps the first occurrence when duplicate ids exist', () => {
    const onDuplicate = vi.fn();
    const input = [
      { id: '1', name: 'first', pid: null },
      { id: '1', name: 'second', pid: null }
    ];
    const tree = arrayToTree(input, { onDuplicate });
    expect(tree).toHaveLength(1);
    expect(tree[0].name).toBe('first');
    expect(onDuplicate).toHaveBeenCalledOnce();
    expect(onDuplicate).toHaveBeenCalledWith(['1']);
  });

  it('does NOT emit console warnings by default (pure function)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    arrayToTree([
      { id: '1', pid: null },
      { id: '1', pid: null },
      { id: '2', pid: 'ghost' }
    ]);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('reports orphans through the onOrphan callback', () => {
    const onOrphan = vi.fn();
    arrayToTree(
      [
        { id: '1', pid: null },
        { id: '2', pid: 'ghost' },
        { name: 'no-id', pid: null }
      ] as any,
      { onOrphan }
    );
    expect(onOrphan).toHaveBeenCalledOnce();
    const reported = onOrphan.mock.calls[0][0];
    // 既报告"父不存在"的孤儿，也报告"缺 id"的孤儿
    expect(reported).toHaveLength(2);
    const keys = reported.map((n: any) => n.id ?? n.name).sort();
    expect(keys).toEqual(['2', 'no-id']);
  });

  it('drops nodes whose id field is empty string', () => {
    const input = [
      { id: '', pid: null },
      { id: '1', pid: null }
    ];
    const tree = arrayToTree(input);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('1');
  });

  it('drops orphan nodes whose parent does not exist', () => {
    const input = [
      { id: '1', pid: null },
      { id: '2', pid: 'ghost' }
    ];
    const tree = arrayToTree(input);
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(0);
  });

  it('preserves extra fields on each node', () => {
    const input = [{ id: '1', name: 'root', extra: 'x', pid: null }];
    const tree = arrayToTree(input);
    expect(tree[0].extra).toBe('x');
  });

  it('attaches an empty children array to leaf nodes', () => {
    const input = [{ id: '1', pid: null }];
    const tree = arrayToTree(input);
    expect(tree[0].children).toEqual([]);
  });

  it('does NOT preserve pre-existing children data (pure pid-based reconstruction)', () => {
    // 设计决策：输入节点上预存的 children 字段会被忽略，
    // 结果树完全由 pid 关系生成——避免浅拷贝导致的副作用。
    // 这里的 pre-existing 在 map 中是孤儿，会被丢弃。
    const input = [
      {
        id: '1',
        pid: null,
        children: [{ id: 'orphan-pre-existing', pid: '1' }]
      },
      { id: '2', pid: '1' }
    ];
    const tree = arrayToTree(input);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].id).toBe('2');
  });

  it('does not mutate the input array', () => {
    // 浅拷贝保护：调用方修改原数据不应影响结果
    const child = { id: '2', name: 'child', pid: '1' };
    const input = [{ id: '1', pid: null }, child];
    const tree = arrayToTree(input);
    child.name = 'mutated';
    expect(tree[0].children[0].name).toBe('child');
  });

  it('throws when idKey === pidKey', () => {
    expect(() => arrayToTree([], { idKey: 'id', pidKey: 'id' })).toThrow(
      'must be distinct'
    );
  });

  it('throws when idKey === childrenKey', () => {
    expect(() => arrayToTree([], { idKey: 'id', childrenKey: 'id' })).toThrow(
      'must be distinct'
    );
  });

  it('handles numeric ids via toString coercion', () => {
    const input = [
      { id: 1, pid: null },
      { id: 2, pid: 1 },
      { id: 3, pid: 1 }
    ];
    const tree = arrayToTree(input);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('1');
    expect(tree[0].children).toHaveLength(2);
  });

  it('discards cyclic parent references and reports them via onOrphan', () => {
    const onOrphan = vi.fn();
    const tree = arrayToTree(
      [
        { id: 'A', pid: 'B' },
        { id: 'B', pid: 'A' },
        { id: 'root', pid: null }
      ],
      { onOrphan }
    );
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('root');
    expect(onOrphan).toHaveBeenCalledOnce();
    expect(onOrphan.mock.calls[0][0].map((n: any) => n.id).sort()).toEqual([
      'A',
      'B'
    ]);
  });

  it('discards self-referencing nodes (A.pid=A)', () => {
    const onOrphan = vi.fn();
    const tree = arrayToTree([{ id: 'A', pid: 'A' }], { onOrphan });
    expect(tree).toHaveLength(0);
    expect(onOrphan).toHaveBeenCalledOnce();
    expect(onOrphan.mock.calls[0][0]).toHaveLength(1);
  });

  it('does not falsely flag deep but valid trees as cyclic', () => {
    const input = [
      { id: '1', pid: null },
      { id: '2', pid: '1' },
      { id: '3', pid: '2' },
      { id: '4', pid: '3' }
    ];
    const tree = arrayToTree(input);
    expect(tree).toHaveLength(1);
    // 同时验证结果树的层级正确，而不仅是"没抛错"
    expect(tree[0].children[0].children[0].children[0].id).toBe('4');
  });

  it('normalizes numeric pid to string to match id type', () => {
    const input = [
      { id: 1, pid: null },
      { id: 2, pid: 1 }
    ];
    const tree = arrayToTree(input);
    expect(tree[0].children[0].id).toBe('2');
    // pid 统一为 string，保证 id === pid 比较可靠
    expect(tree[0].children[0].pid).toBe('1');
    expect(tree[0].children[0].pid === tree[0].id).toBe(true);
  });

  it('handles a large valid chain efficiently (linear, not quadratic)', () => {
    // 10000 个节点的深链——若实现为 O(n²) 该用例会显著变慢
    const input: Array<{ id: string; pid: string | null }> = [
      { id: '0', pid: null }
    ];
    for (let i = 1; i < 10000; i++) {
      input.push({ id: String(i), pid: String(i - 1) });
    }
    const tree = arrayToTree(input);
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
  });

  it('handles a large cycle efficiently (linear, not quadratic)', () => {
    // 10000 个节点互相成环 + 一个根，若 O(n²) 会明显变慢
    const input: Array<{ id: string; pid: string | null }> = [];
    for (let i = 0; i < 10000; i++) {
      input.push({ id: String(i), pid: String((i + 1) % 10000) });
    }
    input.push({ id: 'root', pid: null });
    const onOrphan = vi.fn();
    const tree = arrayToTree(input, { onOrphan });
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('root');
    expect(onOrphan.mock.calls[0][0]).toHaveLength(10000);
  });

  it('does NOT inject synthetic id/pid fields when custom keys are used', () => {
    // 自定义 key 时不应写入字面 'id' / 'pid' 字段，
    // 避免覆盖节点上恰好同名的业务字段
    const input: any = [
      { uid: '1', parent: null, id: 'BIZ-ID', pid: 'BIZ-PID' },
      { uid: '2', parent: '1', id: 'BIZ-ID-2', pid: 'BIZ-PID-2' }
    ];
    const tree = arrayToTree(input, { idKey: 'uid', pidKey: 'parent' });
    expect(tree).toHaveLength(1);
    const child = tree[0].children[0];
    // 业务字段保持原值，不被合成值覆盖
    expect(child.id).toBe('BIZ-ID-2');
    expect(child.pid).toBe('BIZ-PID-2');
    // 也不新增合成字段（'id'/'pid' 键本来就存在于输入中，值未被改写）
    expect(child.uid).toBe('2');
  });

  it('overwrites id/pid with normalized strings when default keys are used', () => {
    // 默认 key 时归一后的 string 写回 id / pid，保证比较可靠
    const tree = arrayToTree([
      { id: 1, pid: null },
      { id: 2, pid: 1 }
    ]);
    expect(tree[0].id).toBe('1');
    expect(tree[0].children[0].pid).toBe('1');
    expect(tree[0].children[0].pid === tree[0].id).toBe(true);
  });
});
