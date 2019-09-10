<template lang="html">
    <div
        :class="['placeholder', { dark: darkModeEnabled, 'has-image': image && lines > 0 }]"
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
import { mapGetters } from 'vuex';

export default {
    props: {
        image: Boolean,
        large: Boolean,
        lines: Number,
    },

    computed: {
        ...mapGetters(['darkModeEnabled']),
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

        &.dark {
            opacity: 0.5;
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
            $color-white 18%, $color-light-gray 33%);
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
