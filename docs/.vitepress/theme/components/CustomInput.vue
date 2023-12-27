<script setup lang="ts">
import { ref, computed } from 'vue';
import { arrayToTree, treeToArray } from 'tree-conver';
import '@/.vitepress/theme/styles/playground.css';

const props = withDefaults(
  defineProps<{
    data: Array<any>;
    type?: 'tree' | 'array';
    options?: any;
  }>(),
  { type: 'array' }
);
const converMap = {
  tree: treeToArray,
  array: arrayToTree
};

const inputData = computed(() => {
  return JSON.stringify(props.data);
});
const inputOptions: any = ref(JSON.stringify(props.options));
const result = computed(() => {
  console.log(props.type)
  const tempOptions = inputOptions.value || JSON.stringify({});
  try {
    const data = JSON.parse(inputData.value);
    const options = JSON.parse(tempOptions);
    if (Array.isArray(data)) {
      return converMap[props.type](data, options);
    }
  } catch {
    return;
  }
  return;
});
</script>
<template>
  <div class="playground-title">数据：</div>
  <textarea
    class="playground-input"
    v-model="inputData"
  />
  <div class="playground-title">参数：</div>
  <textarea
    class="playground-input"
    v-model="inputOptions"
  />
  <div class="playground-title">输出：</div>
  <pre
    class="playground-output"
  ><code>{{ JSON.stringify(result, null, 2) }}</code></pre>
</template>
