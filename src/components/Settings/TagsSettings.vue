<template lang="html">
  <div>
    <modal title="Manage tags">
      <div class="setting">
        <i class="fas fa-tags" />
        <h5>Tags</h5>

        <button class="primary">
          Manage tags
        </button>
      </div>

      <div slot="content">
        <div class="tag-input">
          <input
            v-model="tagName"
            :placeholder="$t('tags.inputPlaceholder')"
            type="text"
          >

          <input
            :value="tagHex"
            type="color"
            class="color-picker"
            @change="updateColor"
          >
        </div>

        <div class="tag-actions">
          <button
            :disabled="!tagName"
            class="secondary"
            @click="reset"
          >
            {{ $t('global.cancel') }}
          </button>

          <button
            :disabled="isDuplicate && !editing"
            class="primary"
            @click="submit"
          >
            {{ actionLabel }}
          </button>
        </div>

        <div
          v-if="hasTags"
          class="tags"
        >
          <tag
            v-for="(tag, name) in localTags"
            :key="name"
            :label="name"
            :hex="tag.hex"
            @close="deleteTag(name)"
          />
          <!-- @click.native="editTag(tag, name)" -->
        </div>
      </div>
      <!-- <button
  class="small warning"
  :title="$t('list.delete')"
  >
  <i class="far fa-trash-alt" />
  Delete {{ platform.name }} collection
</button> -->

    </modal>
  </div>
</template>

<script>
import Tag from '@/components/Tag';
import Modal from '@/components/Modal';
import { mapState } from 'vuex';

export default {
  components: {
    Tag,
    Modal,
  },

  data() {
    return {
      localTags: {},
      tagName: '',
      tagHex: '',
      originalTagName: '',
      editing: false,
      defaultColor: '#ffcc00',
    };
  },

  computed: {
    ...mapState(['tags']),

    newTag() {
      return {
        hex: this.tagHex,
        games: [],
      };
    },

    textColor() {
      const hexColor = this.tagHex ? this.tagHex.replace('#', 0) : '#000000';

      const r = parseInt(hexColor.substr(0, 2), 16);
      const g = parseInt(hexColor.substr(2, 2), 16);
      const b = parseInt(hexColor.substr(4, 2), 16);

      // eslint-disable-next-line
        const yiq = ((r*299)+(g*587)+(b*114))/1000;

      return yiq >= 128 ? 'dark' : 'light';
    },

    isDuplicate() {
      const tagName = this.tagName.toLowerCase();

      const lowerCaseTags = Object.keys(this.localTags).map(field => field.toLowerCase());

      return lowerCaseTags && lowerCaseTags.includes(tagName);
    },

    hasTags() {
      return Object.keys(this.localTags).length > 0;
    },

    actionLabel() {
      return this.editing
        ? this.$t('global.save')
        : this.$t('tags.createTag');
    },
  },

  mounted() {
    this.reset();
    this.localTags = JSON.parse(JSON.stringify(this.tags));
  },

  methods: {
    submit() {
      if (this.editing) {
        this.saveTag();
      } else {
        this.createTag();
      }
    },

    saveTag() {
      const { tagName, tagHex, tempTag } = this;

      if (tempTag.tagName !== tagName || tempTag.hex !== tagHex) {
        this.$store.commit('UPDATE_TAG', { tagName, tagHex, tempTag });
        this.$bus.$emit('SAVE_TAGS', this.tags);
        this.localTags = JSON.parse(JSON.stringify(this.tags));
        this.reset();
      }
    },

    updateColor(e) {
      this.tagHex = e.srcElement.value;
    },

    createTag() {
      if (!this.tagHex || !this.tagName || this.isDuplicate) {
        return;
      }

      this.$set(this.localTags, this.tagName, this.newTag);
      this.$bus.$emit('SAVE_TAGS', this.localTags);
      this.reset();
    },

    deleteTag(tagName) {
      this.$delete(this.localTags, tagName);
      this.$bus.$emit('SAVE_TAGS', this.localTags, true);
      this.reset();
    },

    reset() {
      this.tagName = '';
      this.tagHex = this.defaultColor;
      this.editing = false;
    },

    editTag({ hex }, tagName) {
      this.tempTag = { tagName, hex };
      this.tagName = tagName;
      this.tagHex = hex;
      this.editing = true;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .tag-input {
    display: grid;
    grid-template-columns: 1fr 40px;
    grid-gap: $gp;
    margin-bottom: $gp;
  }

  .tag-actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: $gp;
  }

  input {
    margin: 0;
  }

  .color-picker {
    -webkit-appearance: none;
    width: 40px;
    height: 40px;
    padding: 0;
    margin: 0;
    border: 0;
  }

  .tag {
    margin: 0 $gp / 2 $gp / 2 0;
  }
</style>
