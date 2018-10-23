<!-- # TODO: load settings and lists on login -->
<!-- # TODO: Improve platform dropdown -->
<!-- # TODO: Finish wiring everything up -->
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
import firebase from 'firebase';

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true,
});


export default {
    /* eslint-disable */
    name: 'App',

    components: {
        NavHeader,
    },

    mounted() {
        firebase.auth().getRedirectResult().then(({ user }) => {
            if (user) {
                this.$store.commit('SET_AUTHORIZING_STATUS', false);
                this.$store.commit('SET_USER', user);
            }
        });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('you are logged in', user);
            } else {
                // if loggedin in state, it means session expired, logout
                console.log('user in store?');
                console.log('no user!');
            }
        });
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
    }
</style>
