<template>
  <section class="container" style="height: 100%">
    <div class="wrapper" id="wrapper">
      <transition name="fade-transform"
                  mode="out-in">
        <router-view/>
      </transition>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'ylvisible-main'
  }
</script>

<style lang="scss" scoped>
  .container {
    .wrapper {
      width: 100%;
      height: 100%;
      text-align: left;
      overflow-y: auto;
    }
  }
</style>
