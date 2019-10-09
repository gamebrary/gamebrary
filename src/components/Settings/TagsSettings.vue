<template lang="html">
    <section class="tags-settings setting-box">
        <h3>Tags</h3>
        <div class="tag-input">
            <input
                type="text"
                v-model="tagName"
                :placeholder="$t('tags.inputPlaceholder')"
            />

            <input
                type="color"
                class="color-picker"
                :value="tagHex"
                @change="updateColor"
            />
        </div>

        <div class="tag-actions">
            <button
                class="secondary small"
                :disabled="!tagName"
                @click="reset"
            >
                {{ $t('global.cancel') }}
            </button>

            <button
                class="primary small"
                :disabled="isDuplicate && !editing"
                @click="submit"
            >
                {{ actionLabel }}
            </button>
        </div>

        <div class="tags" v-if="hasTags">
            <tag
                v-for="(tag, name) in localTags"
                :key="name"
                :label="name"
                :hex="tag.hex"
                @close="deleteTag(name)"
            />
            <!-- @click.native="editTag(tag, name)" -->
        </div>
    </section>
</template>

<script>
import Tag from '@/components/Tag';
import { mapState } from 'vuex';

export default {
    components: {
        Tag,
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

    .tags-settings {
        display: grid;
        grid-gap: $gp;
        margin: $gp 0;
        padding: $gp;
        border-radius: $border-radius;
    }

    .tag-input {
        display: grid;
        grid-template-columns: 1fr 32px;
        grid-gap: $gp / 2;
    }

    .tag-actions {
        display: flex;
        justify-content: space-between;
    }

    input {
        margin: 0;
    }

    .color-picker {
        -webkit-appearance: none;
        width: 32px;
        height: 32px;
        padding: 0;
        margin: 0;
        border: 0;
    }

    .tag {
        margin: 0 $gp / 2 $gp / 2 0;
    }
</style>
