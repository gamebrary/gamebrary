<template lang="html">
    <div class="tags-modal">
        <tag
            v-for="(tag, name) in localTags"
            :key="name"
            :label="name"
            :hex="tag.hex"
            @close="deleteTag(name)"
        />

        <pre>{{ textColor }}</pre>

        <div
            class="add-tag"
            :class="textColor"
            :style="`background-color: ${tagHex}`"
        >
            <input
                type="text"
                v-model="tagName"
                placeholder="Tag name / color"
            />

            <input
                type="color"
                :value="tagHex || '#ffffff'"
                @change="updateColor"
                class="color-picker"
            />

            <span
                class="create-tag"
                @click="createTag"
            >
                <i class="fas fa-plus-circle"></i>
            </span>
            </section>
        </div>
    </div>
</template>

<script>
import Panel from '@/components/Panel/Panel';
import Tag from '@/components/Tag/Tag';
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
            colors: [
                '#eb5a58',
                '#ffd166',
                '#06d6a0',
                '#118ab2',
                '#073b4c',
            ],
            suggestions: [
                'Completed',
                'Digital',
                'Physical',
                'Playing',
                'Abandoned',
            ],
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

            return this.localTags && this.localTags[tagName];
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
        width: 140px;
        height: 18px;
        display: flex;
        align-items: center;
        border-radius: $gp;
        border: 1px solid $color-light-gray;
        transition: color 0.5s ease;

        &.light {
            input {
                transition: all 1s ease;
                color: $color-black;

                &::placeholder {
                    color: $color-black;
                }
            }
        }

        &.dark {
            input {
                transition: all 1s ease;
                color: $color-white;

                &::placeholder {
                    color: $color-white;
                }
            }
        }

        input {
            border: 0;
            border-radius: 0;
            margin: 0;
            padding: 0;
            font-size: 10px;
            background: transparent;
            outline: 0;
            height: 20px;
            padding: 0 $gp / 2;

            &::placeholder {
                color: $color-black;
            }


            &[type="color"] {
                padding: 0;
                width: 25px;
            }
        }

        .create-tag {
            color: $color-green;
            margin: 0 1px;
            height: 18px;
            display: flex;
            align-items: center;

        }
    }

    .color-picker {
        width: 50px;
    }
</style>
