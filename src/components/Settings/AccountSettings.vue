<template lang="html">
    <section>
        <div class="profile">
            <gravatar
                :email="user.email"
                class="avatar"
            />

            <div class="user-info">
                <span>{{ user.displayName }}</span>
                <span>{{ user.email }}</span>
                <small>Joined {{ moment(user.dateJoined).format('ll') }}</small>
                <div class="verified" v-if="user.emailVerified">
                    <i class="fas fa-user-check" />
                    Verified
                </div>
            </div>
        </div>

        <div class="account-actions">
            <button class="tiny accent hollow" @click="signOut">
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
                <button class="tiny error hollow">
                    <i class="fas fa-exclamation-triangle" />
                    {{ $t('settings.deleteAccount.button') }}
                </button>
            </modal>
        </div>
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

    props: {
        value: Object,
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

            db.collection('settings').doc(this.user.uid).delete()
                .then(() => {
                    db.collection('lists').doc(this.user.uid).delete()
                        .then(() => {
                            this.$bus.$emit('TOAST', { message: 'Account deleted' });
                            this.exit();
                        })
                        .catch(() => {
                            this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
                        });
                })
                .catch(() => {
                    this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
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
    @import "~styles/styles.scss";
    @import "settings";

    .profile {
        display: grid;
        grid-template-columns: 100px auto;
        margin: $gp 0;
        position: relative;
        border-radius: $border-radius;
        background-color: $color-light-gray-transparent;
        overflow: hidden;
    }

    .user-info {
        padding: $gp / 2 0;
        display: flex;
        flex-direction: column;
    }

    .verified {
        position: absolute;
        top: $gp / 4;
        right: $gp / 4;
        border-radius: $border-radius;
        padding: $gp / 2;
        background-color: $color-orange;
        color: $color-white;
        font-size: 10px;
    }

    .account-actions {
        display: flex;
        justify-content: space-between;
    }
</style>
