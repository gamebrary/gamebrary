<template lang="html">
    <div class="tags-modal">
        <tag
            v-for="(tag, name) in localTags"
            :key="name"
            :label="name"
            :hex="tag.hex"
            @close="deleteTag(name)"
        />

        <div
            class="add-tag"
            :class="textColor"
        >
            <h5>{{ $t('tags.title.addTag') }}</h5>

            <div class="tag-input">
                <input
                    type="text"
                    v-model="tagName"
                    :placeholder="$t('tags.input.placeholder')"
                />

                <input
                    type="color"
                    :value="tagHex || '#ffffff'"
                    @change="updateColor"
                    class="color-picker"
                />

                <button
                    class="small primary"
                    :disabled="isDuplicate"
                    @click="createTag"
                >
                    <i class="fas fa-plus-circle" />

                    {{ $t('tags.button.createTag') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Panel from '@/components/Panel/Panel';
import Tag from '@/components/Tags/Tag';
import { mapState } from 'vuex';

export default {
    components: {
        Tag,
        Panel,
    },

    data() {
        return {
            localTags: {},
            tagName: '',
            tagHex: '#ffffff',
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
    },

    mounted() {
        this.reset();
        this.localTags = JSON.parse(JSON.stringify(this.tags));
    },

    methods: {
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
        },

        reset() {
            this.tagName = '';
            this.tagHex = '#ffffff';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .add-tag {
        background: $color-lightest-gray;
        border: 1px solid $color-gray;
        border-radius: $border-radius;
        padding: $gp / 2;
        margin-top: $gp;
    }

    .tag-input {
        display: grid;
        grid-template-columns: 1fr 32px auto;
        grid-gap: $gp / 2;

        input {
            margin: 0;
        }
    }

    .color-picker {
        -webkit-appearance: none;
        width: 32px;
        height: 32px;
        padding: 0;
        margin: 0;
    }
</style>
