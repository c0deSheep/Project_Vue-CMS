<template>
  <el-card>
    <slot name="row"></slot>
    <slot name="tree-table"></slot>
    <slot name="pagination"></slot>
  </el-card>
</template>

<script>
  export default {
    name: "Card"
  }
</script>

<style scoped>

</style>