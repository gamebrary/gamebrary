<template lang="html">
    <section class="account-setting">
        <button class="secondary" @click="signOut">
            <i class="fas fa-sign-out-alt" />
            {{ $t('settings.signOut') }}
        </button>

        <modal
            padded
            confirm
            :message="$t('settings.deleteAccount.message')"
            :title="$t('settings.deleteAccount.title')"
            :action-text="$t('settings.deleteAccount.button')"
            @action="deleteAccount"
        >
            <button class="danger">
                <i class="fas fa-exclamation-triangle" />
                {{ $t('settings.deleteAccount.button') }}
            </button>
        </modal>
    </section>
</template>

<script>
import firebase from 'firebase/app';
import Modal from '@/components/Modal';
import Gravatar from 'vue-gravatar';
import moment from 'moment';
import { mapState } from 'vuex';

export default {
    components: {
        Modal,
        Gravatar,
    },

    data() {
        return {
            moment,
        };
    },

    computed: {
        ...mapState(['user']),

        exitUrl() {
            return process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';
        },
    },

    methods: {
        exit() {
            this.$store.commit('CLEAR_SESSION');
            window.location.href = this.exitUrl;
        },

        deleteAccount() {
            const db = firebase.firestore();


            // TOOD: move to actions
            db.collection('settings').doc(this.user.uid).delete()
                .then(() => {
                    // TOOD: move to actions
                    db.collection('lists').doc(this.user.uid).delete()
                        .then(() => {
                            this.$bus.$emit('TOAST', { message: 'Account deleted' });
                            this.exit();
                        })
                        .catch(() => {
                            this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                            this.$router.push({ name: 'sessionExpired' });
                        });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                    this.$router.push({ name: 'sessionExpired' });
                });
        },

        signOut() {
            firebase.auth().signOut()
                .then(() => {
                    this.exit();
                })
                .catch((error) => {
                    this.$bus.$emit('TOAST', { message: error, type: 'error' });
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .account-setting {
        display: grid;
        grid-template-columns: 80px 200px;
        grid-gap: $gp;
    }
</style>
