<template lang="html">
    <button class="tag" v-if="label" :style="size">
        <span >
            <i class="fas fa-times close" v-if="!readonly" />
        </span>
        {{ label }}
    </button>
</template>

<script>
export default {
    props: {
        readonly: {
            type: Boolean,
            default: true,
        },
        label: String,
        color: String,
        size: {
            type: String,
            default: 'xsmall',
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .tag {
        background-color: $color-blue;
        align-items: center;
        justify-content: center;
    }

    .close {
        font-size: $font-size-xsmall;
        margin-right: 2px;
        background: $color-white;
        border-radius: 100%;
        width: 15px;
    }
</style>
