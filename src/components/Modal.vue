<template lang="html">
    <div>
        <div @click="open">
            <slot />
        </div>

        <div :class="['overlay', { show }]" @click="close">
            <div
                :class="['modal-content', { large, confirm, padded }]"
                @click.stop
            >
                <header :class="{ fixed: !title }">
                    <h2 v-if="title">{{ title }}</h2>

                    <button :class="closeButtonClass" @click="close">
                        <i class="fas fa-times" />
                    </button>
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
                            class="small primary"
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
import { mapState } from 'vuex';

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
        large: Boolean,
        confirm: Boolean,
        padded: Boolean,
    },

    data() {
        return {
            show: false,
        };
    },

    computed: {
        ...mapState(['galleryOpen']),

        routeName() {
            return this.$route.name;
        },

        closeButtonClass() {
            return [
                { fixed: !this.title },
                'small',
                'secondary',
                'close-button',
            ];
        },
    },

    watch: {
        routeName() {
            this.close();
        },
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
@import "~styles/styles";

.overlay {
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    height: 100%;
    left: 0;
    margin: 0;
    opacity: .1;
    position: fixed;
    top: 0;
    transition: all 100ms linear;
    visibility: hidden;
    width: 100%;
    z-index: 1;

    &.show {
        visibility: visible;
        transition: all 100ms linear;
        opacity: 1;
    }
}

.modal-content {
    position: relative;
    background: var(--modal-background);
    color: var(--modal-text-color);
    height: auto;
    width: 500px;
    max-height: calc(85vh);
    max-width: 100%;
    overflow: auto;
    margin: $gp * 2 auto $gp;
    padding: 0;
    border-radius: $border-radius;
    cursor: default;

    &.large {
        width: 780px;
        max-width: 100% !important;

        @media($small) {
            max-width: 90vw;
            max-height: 100vh;
        }
    }

    &.padded {
        > section {
            padding: 0 $gp $gp;
        }
    }

    &.confirm {
        @media($small) {
            height: auto;
            border-radius: $border-radius;
        }
    }

    @media($small) {
        border-radius: 0;
        margin: 0;
        height: auto;
        max-height: 100vh;
        height: 100vh;
        width: 100vw;
    }
}

header {
    display: flex;
    top: 0;
    padding: $gp / 2 $gp;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
    min-height: 30px;

    @media($small) {
        padding: $gp * 2 $gp $gp;
        right: 0;
        margin-top: $gp;
    }

    &.fixed {
        position: fixed;
        padding: $gp;
        background-color: transparent !important;
        margin: 0;
        z-index: 99999999;
    }
}

.close-button {
    display: none;

    @media($small) {
        display: block;
    }
}

.actions {
    display: grid;
    grid-gap: $gp;
    grid-template-columns: auto auto;
}
</style>
