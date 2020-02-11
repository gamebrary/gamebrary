<template lang="html">
  <div
    v-if="progress != 100"
    :class="['game-progress', { small }]"
  >
    <div
      class="progress"
      ref="progress"
      :style="style"
    >
      <div
        class="progress-bar-label not-progressed"
        :data-progress="progress"
      ></div>
      <div
        class="progress-bar-label progressed"
        :data-progress="progress"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: String,
      default: '',
    },
    small: {
      type: Boolean,
      default: false,
    },
    view: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      style: '',
    };
  },

  mounted() {
    if (this.view === 'masonry') {
      setTimeout(() => {
        this.styles();
      }, 500);
    } else {
      this.styles();
    }

    window.addEventListener('resize', this.styles);
  },

  methods: {
    styles() {
      const width = this.$refs.progress && this.$refs.progress.clientWidth ? `${this.$el.clientWidth}px` : '0%';

      this.style = `--progress: ${this.progress}%; --progress-width: ${width}`;
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .game-progress {
    display: grid;
    width: 140px;
    align-self: stretch;
    align-items: center;
    justify-items: center;
    margin: $gp / 2 0;

    @media($small) {
      margin: $gp auto;
    }

    .progress {
      display: grid;
      height: 20px;
      width: 100%;
      margin: $gp / 4 0;
      overflow: hidden;
      border-radius: calc(var(--border-radius) / 2);
    }

    .progress-bar-label {
      grid-row: 1;
      grid-column: 1;
      width: 100%;
      overflow: hidden;
      font-weight: bold;

      &::after {
        content: attr(data-progress) "%";
        line-height: 1.5;
        display: block;
        width: 140px;
        text-align: center;
        color: var(--progress-primary-color);
      }

      &.not-progressed {
        background: var(--progress-secondary-color);
      }

      &.progressed {
        z-index: 1;
        width: var(--progress);
        background: var(--progress-primary-color);

        &::after {
          color: var(--progress-text-color);
        }
      }
    }

    &.small {
      width: var(--progress-width);
      margin: 0;

      .progress {
        height: 10px;
      }

      .progress-bar-label {
        font-size: $font-size-xsmall;

        &::after {
          width: var(--progress-width);
          line-height: 1;
        }
      }
    }

    .card-placeholder & {
      .progress-bar-label {
        &.not-progressed {
          background: #a5a2a2;
        }

        &.progressed {
          background: #777777;
        }
      }
    }
  }
</style>
