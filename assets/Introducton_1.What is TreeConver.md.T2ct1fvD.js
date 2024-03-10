import{_ as e,a,o as r,a5 as t}from"./chunks/framework.DupWrZfa.js";const u=JSON.parse('{"title":"Tree-Conver 是什么?","description":"","frontmatter":{},"headers":[],"relativePath":"Introducton/1.What is TreeConver.md","filePath":"Introducton/1.What is TreeConver.md","lastUpdated":1710060437000}'),o={name:"Introducton/1.What is TreeConver.md"},n=t('<h1 id="tree-conver-是什么" tabindex="-1">Tree-Conver 是什么? <a class="header-anchor" href="#tree-conver-是什么" aria-label="Permalink to &quot;Tree-Conver 是什么?&quot;">​</a></h1><p>Tree-Conver 是一个能将扁平节点数组与树形数组相互转换的工具。</p><p>对外导出 <code>arrayToTree</code> 、<code>treeToArray</code> 两个方法。</p><h2 id="性能" tabindex="-1">性能 <a class="header-anchor" href="#性能" aria-label="Permalink to &quot;性能&quot;">​</a></h2><h3 id="数组转树" tabindex="-1">数组转树 <a class="header-anchor" href="#数组转树" aria-label="Permalink to &quot;数组转树&quot;">​</a></h3><p>该方法的时间和空间复杂度均为 O(n)，其中 n 是输入数组的长度。方法中两次遍历数组，一次创建节点 ID 到节点的映射，一次将节点添加到其父节点的 children 数组中。最终存储所有节点和子节点。</p><h3 id="树转数组" tabindex="-1">树转数组 <a class="header-anchor" href="#树转数组" aria-label="Permalink to &quot;树转数组&quot;">​</a></h3><p>该方法采用栈实现迭代，优化了内存和调用堆栈。该方法的时间复杂度与树的深度和节点数有关。最坏情况下为 O(nlogn)，但在树高较小时，即使有多子节点，也能保持 O(n)。</p><p>空间复杂度为 O(n)，栈中节点数组的最大长度等于树的深度。</p>',9),c=[n];function d(i,s,h,_,l,p){return r(),a("div",null,c)}const m=e(o,[["render",d]]);export{u as __pageData,m as default};
