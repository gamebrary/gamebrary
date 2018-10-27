<template lang="html">
    <div class="panel">
        <slot />
    </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.panel {
    padding: $gp / 2;
    border-radius: $border-radius;

    p {
        margin: $gp / 2 0;
    }

    &.warning {
        background: $color-orange;
        color: darken($color-orange, 40);
    }

    &.positive {
        background: $color-green;
        color: lighten($color-green, 50);
    }

    &.info {
        background: $color-gray;
        color: lighten($color-gray, 40);
    }

    &.error {
        background: $color-red;
        color: lighten($color-red, 40);
    }
}
</style>
