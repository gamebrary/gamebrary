<template lang="html">
    <div>
        <div @click="open">
            <slot />
        </div>

        <div :class="['modal', { show }]" @click="close">
            <div class="content" @click.stop>
                <i class="close fas fa-times" @click="close" />
                <h2 v-if="title">{{ title }}</h2>
                <p v-if="message">{{ message }}</p>

                <slot name="content" />

                <div :class="{ actions: actionText }">
                    <button class="small info" @click="close" v-if="showClose">
                        {{ closeText }}
                    </button>

                    <button
                        v-if="actionText"
                        class="small primary action"
                        :disabled="actionDisabled"
                        @click="handleAction"
                    >
                        {{ actionText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        actionText: String,
        title: String,
        message: String,
        showClose: {
            type: Boolean,
            default: true,
        },
        closeText: {
            type: String,
            default: 'Cancel',
        },
        actionDisabled: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            show: false,
        };
    },

    methods: {
        open() {
            this.show = true;
            this.$emit('open');
        },

        handleAction() {
            this.$emit('action');
            this.close();
        },

        close() {
            this.$emit('close');
            this.show = false;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.modal {
    width: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: .1;
    height: 100%;
    transition: all 100ms linear;
    visibility: hidden;
    cursor: pointer;

    &.show {
        visibility: visible;
        transition: all 100ms linear;
        opacity: 1;
    }
}

.content {
    position: relative;
    background: $color-white;
    width: 300px;
    height: auto;
    padding: $gp;
    border-radius: $border-radius;
    cursor: default;
}

.close {
    padding: $gp $gp $gp / 2;
    color: $color-gray;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    transition: color 100ms linear;

    &:hover {
        transition: color 100ms linear;
        color: $color-dark-gray;
    }
}

.actions {
    display: grid;
    grid-gap: $gp;
    grid-template-columns: auto auto;
}

h2 {
    margin: 0;
}
</style>
