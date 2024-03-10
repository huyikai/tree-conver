# 数组转树

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

输入符合规则的数据和参数，看看数组转树实现的效果
<CustomInput type='array' :data="data" :options="options"></CustomInput>
