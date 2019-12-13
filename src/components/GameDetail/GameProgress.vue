<template lang="html">
  <div class="game-progresses">
    <div v-if="hasProgress && !showProgressField" class="progress">
      <div class="markdown">
        <vue-markdown :source="localProgress.text" />
      </div>

      <button class="primary" @click="editProgress">
        Edit progress
      </button>
    </div>

    <div v-if="showProgressField">
      <textarea
        v-model="localProgress.text"
        placeholder="Type progress here"
        cols="30"
        rows="5"
      />

      <small>
        <i class="fab fa-markdown" />
        <a href="https://guides.github.com/features/mastering-markdown/" target="_blank">
          Markdown supported
        </a>
      </small>

      <footer>
        <button class="secondary" @click="reset">
          {{ $t('global.cancel') }}
        </button>

        <button class="primary" @click="saveProgress">
          {{ $t('global.save') }}
        </button>

        <button class="danger" @click="deleteProgress">
          Delete progress
        </button>
      </footer>
    </div>

    <button v-if="!hasProgress && !showProgressField" class="primary" @click="addProgress">
      <i class="fas fa-clock" />
      {{ $t('progresses.addProgress') }}
    </button>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    VueMarkdown,
  },

  data() {
    return {
      showProgressField: false,
      localProgress: {
        text: null,
      },
    };
  },

  computed: {
    ...mapState(['game', 'progresses']),
    ...mapGetters(['gameProgress']),

    hasProgress() {
      return this.gameProgress && this.gameProgress.text;
    },
  },

  mounted() {
    this.reset();
  },

  methods: {
    reset() {
      this.localProgress = this.gameProgress
        ? JSON.parse(JSON.stringify(this.gameProgress))
        : { text: null };

      this.showProgressField = false;
    },

    addProgress() {
      this.showProgressField = true;
    },

    editProgress() {
      this.showProgressField = true;
    },

    deleteProgress() {
      const updatedProgresses = {
        ...this.progresses,
      };

      this.$delete(updatedProgresses, this.game.id);

      this.$bus.$emit('SAVE_PROGRESSES', updatedProgresses, true);
      this.showProgressField = false;
      this.localProgress = {
        text: null,
      };
    },

    saveProgress() {
      const updatedProgresses = {
        ...this.progresses,
      };

      updatedProgresses[this.game.id] = this.localProgress;

      this.$bus.$emit('SAVE_PROGRESSES', updatedProgresses);
      this.showProgressField = false;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .game-progresses {
    max-width: calc(100% - #{$gp});
  }

  .markdown {
    margin-bottom: $gp;
  }

  textarea {
    margin-top: $gp;
    margin-bottom: 0;
    resize: vertical;
    padding: $gp / 2;
  }

  footer {
    display: flex;
    align-items: center;
    margin-top: $gp;

    .secondary {
      margin-right: $gp;
    }

    .danger {
      margin-left: auto;
    }
  }

</style>
