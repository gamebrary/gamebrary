<template lang="html">
    <span
        v-if="label && hex"
        :style="`background-color: ${hex}`"
        :class="['tag', textColor, { readonly }]"
    >
        <i
            v-if="!readonly"
            class="fas fa-times close"
            @click="close"
        />

        <span @click="action">
            {{ label }}
        </span>
    </span>
</template>

<script>
export default {
    props: {
        readonly: Boolean,
        label: String,
        hex: String,
    },

    computed: {
        textColor() {
            const hexColor = this.hex ? this.hex.replace('#', 0) : '#000000';

            const r = parseInt(hexColor.substr(0, 2), 16);
            const g = parseInt(hexColor.substr(2, 2), 16);
            const b = parseInt(hexColor.substr(4, 2), 16);

            // eslint-disable-next-line
            const yiq = ((r*299)+(g*587)+(b*114))/1000;

            return yiq >= 128 ? 'dark' : 'light';
        },
    },

    methods: {
        action() {
            this.$emit('action');
        },

        close() {
            this.$emit('close');
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .tag {
        border-radius: 100px;
        box-shadow: 0 0px 1px #a5a2a2;
        padding: 0 $gp / 2 0 2px;
        min-height: 18px;
        font-size: $font-size-xsmall;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #555555;
        cursor: pointer;
        margin: 0 2px 2px 0;

        &.readonly {
            padding: 0 $gp / 2;
        }

        &.light { color: #fff; }
        &.dark { color: #fff; }
    }

    .close {
        height: 14px;
        width: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        margin-right: 4px;
    }

    .light .close,
    .dark .close {
        &:hover {
            color: var(--danger-text-color);
            background-color: var(--danger-background);
        }
    }

    .light .close {
        background-color: rgba(85, 85, 85, .5);
    }

    .dark .close {
        background-color: rgba(229, 229, 229, .5);
    }
</style>
