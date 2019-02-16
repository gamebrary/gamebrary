<template lang="html">
    <div>
        <div @click="open">
            <slot />
        </div>

        <div :class="['modal', { show }]" @click="close">
            <button class="close-wrapper" :class="{ large }">
                <i class="close fas fa-times" @click="close" />
            </button>

            <div :class="['content', { large, padded }]" @click.stop>
                <header>
                    <h2 v-if="title">{{ title }}</h2>
                </header>
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
        padded: Boolean,
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
    background: rgba(0, 0, 0, 0.8);
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
    background-color: $color-white;
    height: auto;
    width: 320px;
    max-height: calc(85vh);
    max-width: 100%;
    overflow: auto;
    margin: 0 $gp;
    padding: 0;
    border-radius: $border-radius;
    cursor: default;

    &.large {
        width: 780px;

        @media($small) {
            width: 100vw;
        }
    }

    &.padded {
        padding: $gp;
    }

    @media($small) {
        height: auto;
        margin: 0;
        max-height: 100vh;
        height: 100vh;
        border-radius: 0;
        width: 100vw;
    }
}

header {
    position: sticky;
}

.close-wrapper {
    width: 320px;
    max-width: 100%;
    margin: 0 auto;
    position: fixed;
    top: 7.5vh;
    display: flex;
    justify-content: flex-end;
    z-index: 99999999;

    &.large {
        width: 810px;

        @media($small) {
            top: $gp;
        }
    }

    @media($small) {
        width: 100%;
        top: $gp;
    }

    .close {
        padding: $gp;
        color: $color-white;
        color: $color-gray;
        cursor: pointer;
    }
}

.actions {
    display: grid;
    grid-gap: $gp;
    grid-template-columns: auto auto;
}
</style>
