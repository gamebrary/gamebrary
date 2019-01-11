<template lang="html">
    <div class="placeholder" :class="{ 'has-image': image, large }" v-if="image || lines">
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
    @import "~styles/styles.scss";

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
        background: $color-light-gray;
        background: linear-gradient(to right,
            $color-light-gray 8%,
            #F0F0F0 18%, $color-light-gray 33%);
        background-size: 800px 104px;
        height: 96px;
        position: relative;
    }

    .image {
        height: 120px;
        width: 80px;
        @extend .animated-background;
    }

    .text-line {
        height: 12px;
        width: 100%;
        margin-bottom: $gp / 2;
        @extend .animated-background;
    }

    .large {
        .text-line {
            height: 30px;
        }

        .image {
            height: 220px;
            width: 175px;
        }
    }
</style>
