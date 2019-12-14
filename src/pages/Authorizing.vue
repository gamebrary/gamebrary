<template lang="html">
  <div class="authorizing">
    <img src="/static/gamebrary-logo.png" >
    <i class="fas fa-sync-alt fa-2x fast-spin" />
    <h3>Authorizing</h3>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.authorizing {
  background: var(--body-background);
  color: var(--primary-text-color);
  height: 100vh;
  position: fixed;
  top: 0;
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;

  img {
    width: 100px;
    margin-top: 100px;
  }

  i {
    font-size: 1.99999999em;
    margin: $gp;
  }
}
</style>
