<template>
  <div class="error">
    非法访问 404
  </div>
</template>

<script>

export default {
  created () {
    document.querySelector('title').innerText = '页面错误'
  }
}
</script>

<style lang="scss" scoped>
.error {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>
