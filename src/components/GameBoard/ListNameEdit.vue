<template lang="html">
    <div class="list-name">
        <input
            v-if="editing"
            v-model="localListName"
            ref="input"
            :id="listIndex"
            @keyup.enter="save"
            @keyup.esc="save"
        >

        <span v-else @click="edit">
            {{ listName }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        listName: String,
        listIndex: [String, Number],
    },

    data() {
        return {
            editing: false,
            localListName: '',
        };
    },

    methods: {
        handleClick(e) {
            const outsideClickEvent = Number(e.target.id) !== Number(this.listIndex);
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
    }
</style>
