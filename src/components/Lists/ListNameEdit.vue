<template lang="html">
    <div class="list-name">
        <input
            v-if="editing"
            class="small"
            v-model="localListName"
            ref="input"
            @keyup.enter="save"
            @keyup.esc="save"
            @blur="exit"
        >

        <span
            v-else
            :title="$t('list.edit')"
            @click="edit"
        >
            <span>{{ listName }} </span>

            <small>(Click to edit)</small>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        listName: String,
        listIndex: [String, Number],
        gameCount: Number,
    },

    data() {
        return {
            editing: false,
            localListName: '',
        };
    },

    methods: {
        save() {
            this.$store.commit('UPDATE_LIST_NAME', {
                listIndex: this.listIndex,
                listName: this.localListName,
            });

            this.$emit('update');
        },

        edit() {
            this.editing = true;
            this.localListName = this.listName;

            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        },

        exit() {
            if (this.listName !== this.localListName) {
                this.save();
            }

            this.editing = false;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .list-name {
        cursor: pointer;
        width: 100%;

        .edit {
            margin: 0 $gp / 2;
        }
    }
</style>
