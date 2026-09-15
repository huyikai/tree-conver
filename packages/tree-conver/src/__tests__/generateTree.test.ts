import { describe, expect, it, beforeEach } from 'vitest';
import { generateTree, __resetGeneratorCounter } from '../generateTree';

describe('generateTree', () => {
  beforeEach(() => {
    __resetGeneratorCounter();
  });

  it('returns a single node when depth is 0', () => {
    const tree = generateTree(0, 3);
    expect(tree.children).toBeUndefined();
    // 不假设具体 id 值，只验证其结构
    expect(typeof tree.id).toBe('string');
    expect(Number(tree.id)).toBeGreaterThan(0);
  });

  it('creates width children per node when depth > 0', () => {
    const tree = generateTree(2, 2);
    expect(tree.children).toHaveLength(2);
    tree.children!.forEach((c) => {
      expect(c.children).toHaveLength(2);
      c.children!.forEach((gc) => {
        expect(gc.children).toBeUndefined();
      });
    });
  });

  it('produces globally unique ids', () => {
    const tree = generateTree(3, 3) as any;
    const ids: string[] = [];
    const walk = (n: any) => {
      ids.push(n.id);
      n.children?.forEach(walk);
    };
    walk(tree);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('yields deterministic ids across runs when counter is reset', () => {
    const a = generateTree(1, 2) as any;
    __resetGeneratorCounter();
    const b = generateTree(1, 2) as any;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
