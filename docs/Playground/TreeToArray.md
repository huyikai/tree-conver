# 树转数组

<script setup lang='ts'>
  import CustomInput from "@/.vitepress/theme/components/CustomInput.vue"
  const data=ref([{
  id: '1',
  name: 'root',
  children: [
    {
      id: '2',
      name: 'child1'
    },
    {
      id: '3',
      name: 'child2',
      children: [
        {
          id: '4',
          name: 'grandchild'
        }
      ]
    }
  ]
}])

const options=ref({
  childrenKey: 'children',
  ignoreFields: ['name'],
  needParentId: true
})
</script>

输入符合规则的数据和参数，看看树转数组实现的效果。`addFields` 字段中有回调函数无法在此处展示效果。
<CustomInput type='tree' :data="data" :options="options"></CustomInput>
