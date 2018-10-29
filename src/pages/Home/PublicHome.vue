<template lang="html">
    <div class="home">
        <template class="loading" v-if="authorizing">
            <i class="fas fa-circle-notch fast-spin fa-3x" />
            <h3>Authorizing</h3>
        </template>

        <div class="splash" v-else>
            <img src="/static/img/iphone.png" class="iphone" />

            <div class="content">
                <h1>GAMEBRARY</h1>

                <p>A simple and user friendly way to <br> manage your video game collection.</p>

                <img
                    @click="login"
                    src="/static/img/google-signin.png"
                    alt="Sign in with Google"
                    height="40"
                >

                <strong>500+ users! Thank you!</strong>
            </div>
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

    .splash {
        justify-content: center;
        display: flex;
        align-items: center;
        text-align: center;

        @media($small) {
            flex-direction: column;
        }

        .iphone {
            height: 90vh;

            @media($small) {
                height: 50vh;
            }
        }

        .content {
            display: flex;
            align-items: center;
            flex-direction: column;
        }

        p {
            color: $color-gray;
        }

        strong {
            color: $color-green;
        }
    }

    h1 {
        margin: 0;
    }

    img {
        margin-bottom: $gp;
    }
</style>
