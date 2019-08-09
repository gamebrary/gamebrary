<template lang="html">
    <div>
        <div @click="open">
            <slot />
        </div>

        <div :class="['modal', { show }]" @click="close">
            <div
                :class="['modal-content', { large, confirm, padded, dark: darkModeEnabled }]"
                @click.stop
            >
                <button :class="closeButtonClass" @click="close" v-if="!galleryOpen">
                    <i class="fas fa-times" />
                </button>

                <header v-if="title">
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
import { mapGetters, mapState } from 'vuex';

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

    watch: {
        routeName() {
            this.close()
        },
    },

    data() {
        return {
            show: false,
        };
    },

    computed: {
        ...mapGetters(['darkModeEnabled']),
        ...mapState(['galleryOpen']),

        routeName() {
            return this.$route.name;
        },

        closeButtonClass() {
            return [
                {
                    info: this.darkModeEnabled,
                    accent: !this.darkModeEnabled,
                },
                'small',
                'close-button',
            ];
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
@import "~styles/styles.scss";

.modal {
    align-items: center;
    background: rgba(0, 0, 0, 0.8);
    color: $color-dark-gray;
    cursor: pointer;
    display: flex;
    height: 100%;
    justify-content: center;
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
    }

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
        width: 80vw;
    }
}

header {
    position: sticky;
    display: flex;
    top: 0;
    padding: $gp / 2 $gp;
    background-color: $color-white;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
    min-height: 30px;

    @media($small) {
        padding: $gp $gp 0;
    }
}

.close-button {
    display: none;
    position: fixed;
    right: 12px;
    top: $gp / 2;
    z-index: 99999;

    @media($small) {
        display: block;
    }
}

.dark {
    .close-button {
        color: $color-white;
    }

    header {
        background-color: $color-darker-gray;
    }
}

.actions {
    display: grid;
    grid-gap: $gp;
    grid-template-columns: auto auto;
}
</style>
