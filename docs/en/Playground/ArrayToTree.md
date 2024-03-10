# Array to Tree

<script setup lang='ts'>
  import CustomInput from "@/.vitepress/theme/components/CustomInput.vue"
  const data=ref([
    { id: '1', pid: '' },
    { id: '2', pid: '1' },
    { id: '3', pid: '1' },
    { id: '4', pid: '2' }
  ])
  const options=ref({
    idKey:'id',
    pidKey:'pid',
    childrenKey:'children'
  })
</script>

Enter the data and parameters that meet the rules to see the effect of array to tree conversion
<CustomInput type='array' :data="data" :options="options"></CustomInput>
