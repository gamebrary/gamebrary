<template lang="html">
    <nav :class="{ dark: settings && settings.nightMode }">
        <router-link
            tag="button"
            class="logo"
            :to="{ name: isHome ? 'platforms' : 'home' }"
        >
            GAMEBRARY
        </router-link>

        <div class="share">
            <button
                @click="showShareModal"
                v-if="showShareUrl"
                title="Share"
            >
                <i class="fas fa-share-alt" />
            </button>

            <router-link
                v-if="showSettings"
                tag="button"
                :to="{ name: 'settings' }"
            >
                <i class="fas fa-cog" />
            </router-link>
        </div>
    </nav>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import { swal, $error } from '@/shared/modals';
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['user', 'platform', 'settings']),

        isHome() {
            return this.$route.name === 'home';
        },

        showSettings() {
            return this.$route.name !== 'settings';
        },

        showShareUrl() {
            return this.$route.name === 'home' && this.platform;
        },

        shareUrl() {
            const url = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';

            return `${url}/#/s/${this.user.uid}/${this.platform.code}`;
        },
    },

    methods: {
        showShareModal() {
            swal({
                titleText: 'Share your list',
                html: 'Use the following URL to share this list.',
                input: 'url',
                inputValue: this.shareUrl,
                showConfirmButton: false,
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";
    nav {
        user-select: none;
        width: 100vw;
        height: $navHeight;
        display: flex;
        justify-content: center;
        background: $color-white;
        color: $color-dark-gray;

        .logo {
            height: $navHeight;
            font-weight: bold;
        }

        .share {
            position: fixed;
            top: 0;
            right: 0;

            button {
                height: $navHeight;
            }
        }

        &.dark {
            background: $color-darkest-gray;
            color: $color-gray !important;

            .actions {
                a {
                    color: $color-gray;
                }
            }

            .profile {
                background: $color-darkest-gray;

                .info {
                    color: $color-gray;
                }
            }
        }
    }

    main {
        height: 100vh;
        border-right: 2px solid $color-light-gray;
        display: flex;
        flex-direction: column;

        a {
            color: $color-dark-gray;
            grid-template-columns: 40px auto;
            margin-bottom: $gp / 2;
            display: grid;
            align-items: center;
            text-decoration: none;
        }

        i, img {
            width: 40px;
            height: 40px;
            text-align: center;
            justify-content: center;
            align-items: center;
            display: flex;
        }
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    .swal2-input {
        font-size: 10px !important;
    }
</style>
