<template>
  <el-card>
    <slot name="row"></slot>
    <slot name="tree-table"></slot>
    <slot name="table"></slot>
    <slot name="tabs"></slot>
    <slot name="form"></slot>
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