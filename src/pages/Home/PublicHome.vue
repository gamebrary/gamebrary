<template lang="html">
    <div class="home">
        <div class="loading" v-if="authorizing">
            <i class="fas fa-circle-notch fast-spin fa-3x" />
            <h3>Authorizing</h3>
        </div>

        <div v-else>
            <h1>GAMEBRARY</h1>

            <strong>500+ users! Thank you!</strong>

            <p>A simple and user friendly way to manage your video game collection.</p>

            <img
                @click="login"
                src="/static/img/google-signin.png"
                alt="Sign in with Google"
                height="40"
            >
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import { GoogleAuth } from '@/shared/firebase';
import { mapState } from 'vuex';
import Panel from '@/components/Panel/Panel';

export default {
    components: {
        Panel,
    },

    computed: {
        ...mapState(['authorizing']),
    },

    methods: {
        login() {
            this.$store.commit('SET_AUTHORIZING_STATUS', true);

            firebase.auth().signInWithRedirect(GoogleAuth)
                .catch((error) => {
                    /* eslint-disable */
                    console.log(error);
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .home {
        @include container-xs;
    }

    .loading {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: $gp * 3 0;

        h3 {
            margin: $gp / 2 0;
        }
    }

    .actions {
        display: flex;
        align-items: center;
        margin-bottom: $gp;
        border-bottom: 1px solid $color-light-gray;
        padding-bottom: $gp;

        .info {
            margin-left: $gp;
        }
    }

    strong {
        color: $color-green;
    }
</style>
