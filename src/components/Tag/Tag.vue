<template lang="html">
    <span
        v-if="label && hex"
        :style="`background-color: ${hex}`"
        :class="['tag', textColor, { readonly }]"
        @click="action"
    >
        <i
            v-if="!readonly"
            class="fas fa-times close"
            @click="close"
        />

        {{ label }}
    </span>
</template>

<script>
import Tag from '@/components/Tag/Tag';

export default {
    components: {
        Tag,
    },

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
    @import "~styles/styles.scss";

    .tag {
        border-radius: 100px;
        padding: 0 $gp / 2 0 2px;
        min-height: 18px;
        font-size: $font-size-xsmall;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: $color-dark-gray;
        cursor: pointer;
        margin: 0 2px 2px 0;

        &.readonly {
            padding: 0 $gp / 2;
        }

        &.light { color: $color-white; }
        &.dark { color: $color-darkest-gray; }
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
            color: $color-white;
            background-color: $color-red;
        }
    }

    .light .close {
        background-color: $color-dark-gray-transparent;
    }

    .dark .close {
        background-color: $color-light-gray-transparent;
    }
</style>
