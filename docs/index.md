---
layout: custom
aside: false
---

## Usage

```shell
# import dependency
npm i tree-conver
```
```javascript
// Import default export
import treeToArray from "tree-conver"
// or Import Deconstruct Export
import { treeToArray, arrayToTree } from "tree-conver"

// Usage
const tree = [...]
const array = [...]
treeToArray(tree)
arrayToTree(array)
```