interface Item {
  // Add any existing properties
  children?: Item[];
  // Define the new property
  id: string;
}
export const generateTree = (depth: number, width: number): Item => {
  const node: Item = {
    id: Math.floor(Math.random() * 1000000).toString()
  };
  if (depth > 0) {
    node.children = [];
    for (let i = 0; i < width; i++) {
      node.children.push(generateTree(depth - 1, width));
    }
  }
  return node;
};
