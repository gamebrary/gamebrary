<template>
    <div id="app">
        <nav-header />

        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader/NavHeader';

export default {
    name: 'App',

    components: {
        NavHeader,
    },
};
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "~styles/styles.scss";

    body {
        margin: 0;
        font-size: 14px;
    }

    #app {
        height: 100%;
        width: 100%;
        overflow: hidden;

        > main {
            height: calc(100vh - #{$navHeight});
            overflow: auto;
            background: $color-gray;
        }
    }


    @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');

    body {
        font-family: 'Roboto', sans-serif;
        // background: url('/static/background-pattern.png');
    }
</style>
