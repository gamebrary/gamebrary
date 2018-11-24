<template lang="html">
    <div class="list-name">
        <input
            v-if="editing"
            class="small"
            v-model="localListName"
            ref="input"
            :id="`list-${listIndex}`"
            @keyup.enter="save"
            @keyup.esc="save"
        >

        <span class="not-editing" v-else @click="edit">
            <span>{{ listName }} ({{ gameCount }})</span>
            <i class="fas fa-pen" />
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
        handleClick(e) {
            const outsideClickEvent = e.target.id !== `list-${this.listIndex}`;
            const hasChanged = this.listName !== this.localListName;

            if (outsideClickEvent) {
                this.exit();
            }

            if (outsideClickEvent && hasChanged) {
                this.save();
            }
        },

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
                document.addEventListener('click', this.handleClick);
                this.$refs.input.focus();
            });
        },

        exit() {
            this.editing = false;

            this.$nextTick(() => {
                document.removeEventListener('click', this.handleClick);
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .list-name {
        cursor: pointer;
        width: 100%;

        .not-editing {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>
