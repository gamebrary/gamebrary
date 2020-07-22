<template lang="html">
  <div>
    <div @click="open">
      <slot />
    </div>

    <div :class="['overlay', { show }]" @click="close">
      <div :class="['modal-content', { large }]" @click.stop>
        <h2 v-if="title">{{ title }}</h2>

        <b-button class="close-button" @click="close">
          <i class="fas fa-times" />
        </b-button>

        <main>
          <span v-if="message" v-html="message" />
          <slot v-if="show" name="content" />

          <footer v-if="actionText">
            <b-button
              :class="actionButtonClass"
              :disabled="actionDisabled"
              @click="handleAction"
            >
              {{ actionText }}
            </b-button>
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
  // @import "~styles/styles";

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
    z-index: 2;

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
    max-height: calc(100% - 4rem);
    overflow-y: auto;
    margin: 2rem auto 1rem;
    padding: 0;
    border-radius: var(--border-radius);
    cursor: default;

    @media(max-width: 780px) {
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
    right: 1rem;
    top: .5rem;
    z-index: 9999;

    @media(min-width: 781px) {
      display: none;
    }
  }

  h2 {
    display: flex;
    padding: 1rem;
    z-index: 2;
    align-items: center;
    justify-content: space-between;
  }

  main {
    padding: 0 1rem 1rem;
    overflow-y: auto;
  }

  footer {
    margin-top: 1rem;
  }
</style>
