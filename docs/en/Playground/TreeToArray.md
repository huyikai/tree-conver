# Tree to Array

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

Enter the data and parameters that meet the rules to see the effect of tree to array conversion. The `addFields` field with callback functions cannot be demonstrated here.
<CustomInput type='tree' :data="data" :options="options"></CustomInput>
