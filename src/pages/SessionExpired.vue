<template lang="html">
    <div class="session-expired">
        <h2>Session expired</h2>

        <div class="actions">
            <button class="success" @click="login">Login</button>
            <a class="link primary" :href="exitUrl">Exit</a>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        exitUrl() {
            return process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';
        },

        homeUrl() {
            return process.env.NODE_ENV === 'development'
                ? 'http://localhost:4000'
                : 'https://app.gamebrary.com';
        },
    },

    methods: {
        login() {
            this.$store.commit('CLEAR_SESSION');
            window.location.href = this.homeUrl;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .session-expired {
        color: $color-dark-gray;
        min-height: calc(100vh - #{$navHeight});
        padding: 0 $gp;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .actions {
        display: grid;
        margin-top: $gp;
        grid-template-columns: auto auto;
        grid-gap: $gp;
        text-align: center;
        align-items: center;
    }
</style>
