<template lang="html">
  <div>
    <div @click="open">
      <slot />
    </div>

    <div :class="['overlay', { show }]" @click="close">
      <div :class="['modal-content', { large }]" @click.stop>
        <header>
          <h2 v-if="title">{{ title }}</h2>


          <button class="secondary small close-button" @click="close">
            <i class="fas fa-times" />
          </button>
        </header>

        <main>
          <span v-if="message" v-html="message" />
          <slot v-if="show" name="content" />

          <footer v-if="actionText">
            <button
              :class="actionButtonClass"
              :disabled="actionDisabled"
              @click="handleAction"
            >
              {{ actionText }}
            </button>
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actionText: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    actionButtonClass: {
      type: String,
      default: 'primary',
    },
    actionDisabled: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      show: false,
    };
  },

  computed: {
    routeName() {
      return this.$route.name;
    },
  },

  watch: {
    routeName() {
      this.close();
    },
  },

  methods: {
    open() {
      this.show = true;
      this.$emit('open');
    },

    handleAction() {
      this.$emit('action');
      this.close();
    },

    close() {
      this.$emit('close');
      this.show = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .overlay {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: grayscale(10%) blur(1px);
    cursor: pointer;
    height: 100%;
    left: 0;
    margin: 0;
    opacity: .1;
    position: fixed;
    top: 0;
    transition: all 100ms linear;
    visibility: hidden;
    width: 100%;
    z-index: 1;

    &.show {
      visibility: visible;
      transition: all 100ms linear;
      opacity: 1;
    }
  }

  .modal-content {
    background: var(--modal-background);
    color: var(--modal-text-color);
    width: 500px;
    height: auto;
    max-height: calc(100% - #{$gp * 4});
    overflow-y: auto;
    margin: $gp * 2 auto $gp;
    padding: 0;
    border-radius: $border-radius;
    cursor: default;

    @media($small) {
      border-radius: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
    }

    &.large {
      width: 780px;
      max-width: 100%;
    }
  }

  .close-button {
    position: fixed;
    right: $gp;
    top: $gp / 2;

    @media($desktop) {
      display: none;
    }
  }

  header {
    display: flex;
    padding: $gp;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
  }

  main {
    padding: 0 $gp $gp;
    overflow-y: auto;
  }

  footer {
    margin-top: $gp;
  }
</style>
