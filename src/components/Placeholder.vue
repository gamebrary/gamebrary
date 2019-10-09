<template lang="html">
    <div
        :class="['placeholder', { 'has-image': image && lines > 0 }]"
        v-if="image || lines"
    >
        <div class="image" v-if="image" />

        <div class="text" v-if="lines">
            <div
                class="text-line"
                v-for="n in lines"
                :key="n"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        image: Boolean,
        large: Boolean,
        lines: Number,
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .placeholder {
        max-width: 100%;

        &.has-image {
            display: grid;
            grid-template-columns: 80px auto;
            grid-gap: $gp;
        }
    }

    // Animation
    @keyframes placeholder{
        0%{
            background-position: -468px 0
        }
        100%{
            background-position: 468px 0
        }
    }

    .animated-background {
        animation-duration: 1s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeholder;
        animation-timing-function: linear;
        background: #e5e5e5;
        background: linear-gradient(to right, #e5e5e5 8%, #fff 18%, #e5e5e5 33%);
        background-size: 800px 104px;
        height: 96px;
        position: relative;
    }

    .image {
        width: var(--placeholder-image-width, 80px);
        height: var(--placeholder-image-height, 120px);
        @extend .animated-background;
    }

    .text-line {
        width: var(--placeholder-text-width, 100%);
        height: var(--placeholder-text-height, 12px);
        margin-bottom: $gp / 2;
        @extend .animated-background;
    }
</style>
