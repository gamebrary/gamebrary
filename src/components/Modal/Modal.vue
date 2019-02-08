<template lang="html">
    <div>
        <div @click="open">
            <slot />
        </div>

        <div :class="['modal', { show }]" @click="close">
            <div :class="['content', { large, 'no-padding': noPadding }]" @click.stop>
                <i class="close fas fa-times" @click="close" />
                <h2 v-if="title">{{ title }}</h2>
                <p v-if="message">{{ message }}</p>

                <slot name="content" v-if="show" />

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
        large: Boolean,
        noPadding: Boolean,
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
    color: $color-dark-gray;
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
    height: auto;
    width: 320px;
    overflow: auto;
    padding: $gp;
    border-radius: $border-radius;
    cursor: default;
    max-height: calc(100vh - 32px);

    &.no-padding {
        padding: 0;
    }

    &.large {
        width: 700px;
        max-width: 100%;
    }

    @media($small) {
        height: auto;
        max-height: 100vh;
        border-radius: 0;
    }
}

.close {
    opacity: 0;
    position: fixed;

    @media($small) {
        opacity: 1;
        top: 0;
        right: 0;
        background: $color-white;

        padding: $gp;
        color: $color-gray;
        position: fixed;
        top: 0;
        right: 0;
        cursor: pointer;
        transition: color 100ms linear;
        z-index: 2;

        &:hover {
            transition: color 100ms linear;
            color: $color-dark-gray;
        }
    }
}

.actions {
    display: grid;
    grid-gap: $gp;
    grid-template-columns: auto auto;
}
</style>
