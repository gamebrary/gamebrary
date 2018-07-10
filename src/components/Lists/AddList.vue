<template lang="html">
    <div class="add-list">
        <md-dialog-prompt
            :md-active.sync="showAddListModal"
            v-model="newListName"
            md-title="Add new list"
            md-input-maxlength="30"
            md-input-placeholder="Type list name"
            md-confirm-text="Add list"
            @md-confirm="addList"
            @md-cancel="clearList"
        />

        <md-dialog-alert
            :md-active.sync="showDuplicateError"
            :md-content="errorMessage"
            md-title="Uh oh"
            md-confirm-text="Dismiss"
        />

        <md-button
            :class="['md-icon-button md-raised md-default', { nightMode }]"
            @click="showAddListModal = true"
        >
            <md-icon>add</md-icon>
        </md-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showAddListModal: false,
            showDuplicateError: false,
            newListName: '',
        };
    },

    computed: {
        errorMessage() {
            return `You already have a list named <strong>${this.newListName}</strong>. Please use a different name.`;
        },

        lists() {
            return this.$store.state.user.lists;
        },

        nightMode() {
            return this.$store.state.user.settings.nightMode;
        },
    },

    methods: {
        addList() {
            if (this.isDuplicateListName()) {
                this.showDuplicateError = true;
                return;
            }

            this.$store.commit('ADD_LIST', this.newListName);
            this.$emit('update');
            this.$emit('scroll');
            this.newListName = '';
        },

        isDuplicateListName() {
            const newListName = this.newListName.toLowerCase();
            return this.lists.filter(list => list.name.toLowerCase() === newListName).length;
        },

        clearList() {
            this.newListName = '';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .add-list {
        padding-right: $gp;

        .md-icon-button {
            margin: 0;
        }
    }

    .nightMode {
        background: $nin-gray !important;
    }
</style>
