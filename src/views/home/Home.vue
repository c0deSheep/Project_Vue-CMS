<template>
  <div class="home">
      Home
    <el-button type="info" @click="logout">logout</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      logout () {
        console.log('works')
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped>

</style>