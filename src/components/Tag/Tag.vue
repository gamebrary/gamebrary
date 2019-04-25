<template lang="html">
    <span
        v-if="label && hex"
        class="tag"
        :style="`background-color: ${hex}`"
        :class="textColor"
        @click="action"
    >
        <i class="fas fa-times close" @click="close" />

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
        padding: 2px;
        font-size: $font-size-xsmall;
        display: flex;
        align-items: center;
        color: $color-dark-gray;
        cursor: pointer;

        &.light { color: $color-white; }
        &.dark { color: $color-darkest-gray; }
    }

    .close {
        height: 15px;
        width: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        margin-right: 4px;
    }

    .light .close {
        background-color: $color-dark-gray-transparent;

        &:hover {
            color: $color-red;
            background-color: $color-light-gray-transparent;
        }
    }

    .dark .close {
        background-color: $color-light-gray-transparent;
    }
</style>
