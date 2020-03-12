<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import './style/common.scss'

export default {
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  max-width: 700px;
  min-width: 375px;
  margin: 0 auto;
  overflow: hidden;
  // background:rgba(242,242,242,1);
}
</style>
