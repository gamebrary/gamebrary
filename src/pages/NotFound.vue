<template lang="html">
    <div class="not-found-page">
        <h1>404</h1>
        <h3>{{ $t('pageNotFound') }}</h3>

        <a :href="homeUrl" class="link primary">
            {{ $t('returnHome') }}
        </a>
    </div>
</template>

<script>
export default {
    computed: {
        homeUrl() {
            return process.env.NODE_ENV === 'development'
                ? 'http://localhost:4000'
                : 'https://app.gamebrary.com';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .not-found-page {
        color: #555555;
        min-height: calc(100vh - #{$navHeight});
        padding: 0 $gp;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    h1 {
        font-size: 300px;
    }

    h3 {
        font-size: 50px;
        margin-bottom: $gp;
    }

    a.link {
        display: flex;
        align-items: center;
    }
</style>
