<template lang="html">
    <div>
        <div @click="open">
            <slot />
        </div>

        <div :class="['modal', { show, popover }]" @click="close">
            <i
                v-if="popover"
                :class="['fas fa-caret-up popover-arrow', { dark: darkModeEnabled }]"
            />

            <div :class="['content', { large, padded, dark: darkModeEnabled }]" @click.stop>
                <i class="close fas fa-times" @click="close" v-if="!popover" />

                <header v-if="!popover && title">
                    <h2>{{ title }}</h2>
                </header>

                <section>
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
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        actionText: String,
        title: String,
        message: String,
        showClose: {
            type: Boolean,
            default: false,
        },
        closeText: {
            type: String,
            default: 'Cancel',
        },
        actionDisabled: {
            type: Boolean,
            default: false,
        },
        popover: Boolean,
        large: Boolean,
        padded: Boolean,
    },

    data() {
        return {
            show: false,
        };
    },

    computed: {
        ...mapGetters(['darkModeEnabled']),
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

    &.popover {
        background: none;
        justify-content: flex-end;
        align-items: baseline;

        .content {
            @media($small) {
                height: auto;
            }
        }
    }

    &.show {
        visibility: visible;
        transition: all 100ms linear;
        opacity: 1;
    }

    .content {
        position: relative;
        background-color: $color-white;
        height: auto;
        width: 380px;
        max-height: calc(85vh);
        max-width: 100%;
        overflow: auto;
        margin: 0 $gp;
        padding: 0;
        border-radius: $border-radius;
        cursor: default;

        &.dark {
            background-color: $color-darker-gray;
            color: $color-gray;
            border: 1px solid $color-darker-gray;
        }

        &.large {
            width: 780px;

            @media($small) {
                width: 100vw;
            }
        }

        &.padded {
            > section {
                padding: 0 $gp $gp;
            }
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

    &.popover .content {
        max-width: 280px;
        margin: $gp * 3 $gp 0;
    }
}

header {
    position: sticky;
    display: flex;
    top: 0;
    padding: $gp $gp 0;
    z-index: 2;
    align-items: center;
    justify-content: space-between;
    min-height: 30px;
}

.close {
    display: none;
    position: fixed;
    top: 0;
    align-items: center;
    color: $color-white;
    text-shadow: 0 0 3px $color-black;
    right: 0;
    font-size: 30px;
    z-index: 99999;
    padding: $gp;

    @media($small) {
        display: flex;
    }
}

.actions {
    display: grid;
    grid-gap: $gp;
    grid-template-columns: auto auto;
}

.popover-arrow {
    color: $color-white;
    font-size: 25px;
    position: absolute;
    top: $gp * 2;
    right: $gp * 1.5;

    &.dark {
        color: $color-darker-gray;
    }
}
</style>
