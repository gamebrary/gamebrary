<template lang="html">
    <div>
        <div @click="open">
            <slot />
        </div>

        <div :class="['overlay', { show, confirm }]" @click="close">
            <div :class="['modal-content', { large, confirm }]" @click.stop>
                <header :class="{ fixed: !title }">
                    <h2 v-if="title">{{ title }}</h2>

                    <button class="secondary small" @click="close">
                        <i class="fas fa-times" />
                    </button>
                </header>

                <main :class="{ padded }">
                    <span v-if="confirm && message">{{ message }}</span>
                    <slot name="content" v-else-if="show" />
                </main>

                <footer>
                    <button
                        v-if="actionText && confirm"
                        :class="actionButtonClass"
                        :disabled="actionDisabled"
                        @click="handleAction"
                    >
                        {{ actionText }}
                    </button>

                    <slot v-else name="footer" />
                </footer>

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
        actionButtonClass: {
            type: String,
            default: 'primary',
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
        routeName() {
            return this.$route.name;
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
        background: rgba(0, 0, 0, 0.8);
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

        &.confirm {
            display: flex;
            align-items: flex-start;
            justify-content: center;

            @media($small) {
                align-items: flex-end;
            }
        }
    }

    .modal-content {
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
        display: flex;
        flex-direction: column;

        @media($small) {
            border-radius: 0;
            margin: 0;
            height: 100%;
            max-height: 100vh;
            height: 100vh;
            width: 100vw;
        }

        &.large {
            width: 780px;
            max-width: 100% !important;

            @media($small) {
                max-width: 90vw;
                max-height: 100vh;
            }
        }

        &.confirm {
            height: auto;
            max-width: calc(100vw - #{$gp * 4});
            border-radius: $border-radius;

            @media($small) {
                margin-bottom: $gp * 2;
            }
        }
    }

    header {
        display: flex;
        padding: $gp;
        z-index: 1;
        align-items: center;
        justify-content: space-between;

        @media($small) {
            right: 0;
        }

        &.fixed {
            position: fixed;
            padding: $gp;
            background-color: transparent !important;
            margin: 0;
            z-index: 99999999;
        }
    }

    main {
        &.padded {
            padding: 0 $gp;
        }

        flex-grow: 1;
        max-height: calc(100% - 144px);
        overflow: auto;
    }

    footer {
        padding: $gp;
        margin-top: auto;
    }
</style>
