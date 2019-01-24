<template lang="html">
    <div class="home">
        <template class="loading">
            <i class="fas fa-circle-notch fast-spin fa-3x" />
            <h3>Authorizing</h3>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['user']),
    },

    mounted() {
        if (this.user) {
            this.$router.push('game-board');
        }
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .home {
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100vh;
        padding: 0 $gp * 2;
    }

    .loading {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: $gp * 3 0;
    }
</style>
