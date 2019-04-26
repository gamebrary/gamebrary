<template lang="html">
    <div class="tags-modal">
        <div class="content">
            <div class="my-tags">
                <h3>My tags</h3>

                <div class="tags" v-for="(tag, name) in localTags" :key="name">
                    <tag
                        v-if="localTags.includes(game.id)"
                        :label="name"
                        :hex="tag.hex"
                        @close="deleteTag(name)"
                    />
                </div>
            </div>

            <div class="add-tag">
                <h3>Add new tag</h3>

                <panel class="warning" v-if="isDuplicate">
                    <i class="fas fa-exclamation-triangle" />
                    <small>A tag named
                        <strong>{{ tagName.toLowerCase() }}</strong>
                         already exists.</small>
                </panel>

                <section>
                    <h4>1. Tag name</h4>
                    <input type="text" v-model="tagName">

                    <div class="suggestions">
                        <small>Suggestions:</small>

                        <br />

                        <button
                            v-for="name in suggestions"
                            :key="`tag-${name}`"
                            class="tag info hollow small suggestion"
                            :disabled="localTags[name]"
                            @click="tagName = name"
                        >
                            {{ name }}
                        </button>
                    </div>
                </section>

                <section>
                    <h4>2. Tag color</h4>

                    <button
                        v-for="color in colors"
                        :key="`tag-${color}`"
                        class="tag small color"
                        :style="`background-color: ${color}`"
                        @click="tagHex = color"
                    >
                        <i class="fas fa-fill-drip" />
                    </button>

                    <input type="color" :value="tagHex" @change="updateColor" class="color-picker">
                    <pre>{{ tagHex }}</pre>
                </section>

                <section>
                    <h4>3. Review and save</h4>
                    <button class="tag small" :style="`background-color: ${tagHex || '#ccc'}`">
                        {{ tagName || 'Enter tag name' }}
                    </button>
                </section>

                <button
                    class="small primary action"
                    :disabled="!tagHex || !tagName || isDuplicate"
                    @click="createTag"
                >
                    Create tag
                </button>
            </div>
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
            tagHex: '',
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
            this.$set(this.localTags, this.tagName, this.newTag);
            this.$bus.$emit('SAVE_TAGS', this.localTags);
            this.reset();
        },

        deleteTag(tagName) {
            this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.game.id });
            this.$bus.$emit('SAVE_TAGS', this.tags);
        },

        reset() {
            this.tagName = '';
            this.tagHex = '';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    h4 {
        margin: $gp 0 $gp / 2;
    }

    input {
        margin: 0;
    }

    .suggestions {
        margin-top: $gp / 2;
    }

    .suggestion, .color {
        display: inline-flex;
        margin: $gp / 4 $gp / 4 0 0;
    }

    .actions {
        display: grid;
        grid-gap: $gp;
        grid-template-columns: auto;
    }

    section {
        border-bottom: 1px solid $color-light-gray;
        padding-bottom: $gp;
        margin-bottom: $gp;
    }

    .content {
        display: grid;
        grid-gap: $gp;
        grid-template-columns: 1fr 2fr;
    }

    .my-tags {
        // display: grid;
    }

    .color-picker {
        width: 50px;
    }
</style>
