import { describe, expect, it } from 'vitest';
import { treeToArray } from '../treeToArray';

describe('treeToArray', () => {
  const sample = [
    {
      id: '1',
      name: 'root',
      children: [
        {
          id: '2',
          name: 'child-1',
          children: [{ id: '4', name: 'grandchild' }]
        },
        { id: '3', name: 'child-2' }
      ]
    }
  ];

  it('flattens a tree to an array preserving depth-first order', () => {
    const nodes = treeToArray(sample);
    expect(nodes.map((n) => n.id)).toEqual(['1', '2', '4', '3']);
  });

  it('attaches parentId to each non-root node', () => {
    const nodes = treeToArray(sample);
    expect(nodes[0].parentId).toBeNull();
    expect(nodes[1].parentId).toBe('1');
    expect(nodes[2].parentId).toBe('2');
    expect(nodes[3].parentId).toBe('1');
  });

  it('does not attach parentId when needParentId is false', () => {
    const nodes = treeToArray(sample, { needParentId: false });
    expect(nodes.every((n) => !('parentId' in n))).toBe(true);
  });

  it('supports custom idKey / childrenKey', () => {
    const tree = [{ uid: '1', kids: [{ uid: '2' }] }];
    const nodes = treeToArray(tree, { idKey: 'uid', childrenKey: 'kids' });
    expect(nodes.map((n) => n.uid)).toEqual(['1', '2']);
    expect(nodes[1].parentId).toBe('1');
  });

  it('ignores configured fields', () => {
    const nodes = treeToArray(sample, { ignoreFields: ['name'] });
    expect(nodes.every((n) => !('name' in n))).toBe(true);
  });

  it('adds custom fields via callback', () => {
    const nodes = treeToArray(sample, {
      addFields: [
        { fieldName: 'tag', callback: (item) => `tag-${item.id}` }
      ]
    });
    expect(nodes.map((n) => n.tag)).toEqual(['tag-1', 'tag-2', 'tag-4', 'tag-3']);
  });

  it('returns parentId=null (not empty string) when child has no id', () => {
    const tree = [{ children: [{ name: 'orphan' }] }];
    const nodes = treeToArray(tree);
    expect(nodes[1].parentId).toBeNull();
  });

  it('returns an empty array for empty input', () => {
    expect(treeToArray([])).toEqual([]);
  });

  it('handles deep nesting without recursion limit', () => {
    let node: any = { id: 'leaf' };
    for (let i = 0; i < 5000; i++) {
      node = { id: `n-${i}`, children: [node] };
    }
    const tree = [node];
    const nodes = treeToArray(tree);
    expect(nodes).toHaveLength(5001);
    expect(nodes[nodes.length - 1].id).toBe('leaf');
  });

  it('preserves user-provided parentId field when needParentId is false', () => {
    // needParentId=false 时不应丢弃节点上自带的 parentId 业务字段
    const tree = [{ id: '1', parentId: 'keep-me', children: [{ id: '2' }] }];
    const nodes = treeToArray(tree, { needParentId: false });
    expect(nodes[0].parentId).toBe('keep-me');
  });

  it('overwrites user parentId with synthetic value when needParentId is true', () => {
    const tree = [{ id: '1', children: [{ id: '2' }] }];
    const nodes = treeToArray(tree);
    expect(nodes[0].parentId).toBeNull();
    expect(nodes[1].parentId).toBe('1');
  });
});
