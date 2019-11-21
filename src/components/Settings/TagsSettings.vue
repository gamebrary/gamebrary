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

          <div class="color-picker-wrapper">
            <i class="fas fa-fill-drip" />

            <input
              :value="tagHex"
              type="color"
              class="color-picker"
              @change="updateColor"
            >
          </div>

          <div class="color-picker-wrapper">
            <i class="fas fa-font" />
            <input
              :value="tagTextColor"
              type="color"
              class="color-picker"
              @change="updateTextColor"
            >
          </div>

          <div class="preview">
            <tag
              label="Preview"
              :hex="tagHex"
              :textHex="tagTextColor"
            />
          </div>

          <div class="exclusive-toggle">
            Exclusive to {{ platform.name }}

            <toggle-switch
              id="global"
              v-model="exclusive"
            />
          </div>
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
            :disabled="isDuplicate"
            class="primary"
            @click="createTag"
          >
            {{ $t('global.save') }}
          </button>
        </div>

        <div v-if="hasTags" class="tags">
          <!-- TODO: use computed properties for filtering out tags -->
          <section>
            <h3>All tags</h3>

            <tag
              v-for="(tag, name) in localTags"
              v-if="!tag.platform"
              :key="name"
              :label="name"
              :hex="tag.hex"
              :text-hex="tag.tagTextColor"
              @close="deleteTag(name)"
            />
          </section>

          <section>
            <h3>{{ platform.name }} tags</h3>

            <tag
              v-for="(tag, name) in localTags"
              v-if="tag.platform && tag.platform === platform.id"
              :key="name"
              :label="name"
              :hex="tag.hex"
              :text-hex="tag.tagTextColor"
              @close="deleteTag(name)"
            />
          </section>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch';
import Tag from '@/components/Tag';
import Modal from '@/components/Modal';
import { mapState } from 'vuex';

export default {
  components: {
    Tag,
    Modal,
    ToggleSwitch,
  },

  data() {
    return {
      localTags: {},
      tagName: '',
      tagHex: '',
      tagTextColor: '#f4b41a',
      defaultColor: '#143d59',
      exclusive: false,
    };
  },

  computed: {
    ...mapState(['tags', 'platform']),

    newTag() {
      return {
        hex: this.tagHex,
        tagTextColor: this.tagTextColor,
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
  },

  mounted() {
    this.reset();
    this.localTags = JSON.parse(JSON.stringify(this.tags));
  },

  methods: {
    updateColor(e) {
      this.tagHex = e.srcElement.value;
    },

    updateTextColor(e) {
      this.tagTextColor = e.srcElement.value;
    },

    createTag() {
      if (!this.tagHex || !this.tagName || this.isDuplicate) {
        return;
      }

      if (this.exclusive) {
        this.newTag.platform = this.platform.id;
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
      this.exclusive = false;

      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .tag-input {
    display: grid;
    grid-template-columns: 1fr 40px 40px 60px;
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

  .tags {
    display: grid;
    grid-gap: $gp / 2;

    h3 {
      margin-bottom: $gp / 2;
    }
  }

  .exclusive-toggle {
    display: flex;
    align-items: center;
  }

  .color-picker-wrapper {
    i {
      position: absolute;
      width: 40px;
      text-shadow: 0 1px 0 #000;
      height: 40px;
      display: flex;
      overflow: visible;
      pointer-events: none;
      align-items: center;
      justify-content: center;
    }
  }

  .preview {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
