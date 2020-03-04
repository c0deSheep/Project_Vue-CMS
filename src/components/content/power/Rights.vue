<template>
  <div>
    <!--面包屑导航区域-->
    <breadcrumb>
      <span slot="subName">权限管理</span>
      <span slot="itemName">权限列表</span>
    </breadcrumb>

    <!--卡片视图-->
    <rights-card>

    </rights-card>
  </div>
</template>

<script>
  import Breadcrumb from '../../common/breadcrumb/Breadcrumb'
  import RightsCard from './child/rights/RightsCard'

  export default {
    name: "Rights",
    components : {
      Breadcrumb,
      RightsCard,
    }
  }
</script>

<style scoped>

</style>