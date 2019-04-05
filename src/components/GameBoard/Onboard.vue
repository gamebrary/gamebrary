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
        flex-shrink: 0;
        margin-right: $gp;
        padding-right: 60px;
        text-align: center;
        background: url('/static/img/arrow-black.png') no-repeat center right;
        background-size: 50px;

        @media($small) {
            background-size: 30px;
            padding-right: 40px;
            margin-right: $gp / 2;

            h2 {
                font-size: 13px;
                text-align: left;
            }

            h3 {
                font-size: 12px;
            }
        }

        &.dark {
            background: url('/static/img/arrow-white.png') no-repeat center right;
            background-size: 50px;
            color: $color-gray;
        }
    }
</style>
