<template lang="html">
    <div :class="['onboard', { dark: darkModeEnabled}]">
        <h2>Your {{ platform.name }} <br> collection is empty</h2>
        <h3>Create your first list!</h3>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapState(['platform']),
        ...mapGetters(['darkModeEnabled']),
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .onboard {
        padding: 0 $gp * 3;
        margin: 0 $gp;
        text-align: center;
        background: url('/static/img/arrow-black.png') no-repeat center right;
        background-size: 50px;

        &.dark {
            background: url('/static/img/arrow-white.png') no-repeat center right;
            background-size: 50px;
            color: $color-gray;
        }
    }
</style>
