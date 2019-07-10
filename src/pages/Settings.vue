<template lang="html">
    <div class="settings" :class="{ dark: darkModeEnabled }">
        <nav>
            <a
                class="setting-link"
                v-for="section in settingsSections"
                :key="section.name"
                :class="{ active: activeSection === section.name }"
                @click="openSettings(section)"
            >
                <i :class="section.icon" />
                {{ $t(`settings.${section.name}`) }}
            </a>
        </nav>

        <main>
            <component
                v-if="Object.keys(localSettings).length > 0"
                :is="activeComponent"
                :reloading="reloading"
                v-model="localSettings"
            />
        </main>

        <!-- <footer>
            <small class="copyright">
                <small>
                    <i class="far fa-copyright" /> {{ moment().format('YYYY') }} Gamebrary
                </small>

                <br>

                <span>
                    <i class="fab fa-github" />
                    {{ latestRelease }}
                </span>

                <i class="fas fa-code" />
                {{ $t('global.by') }}
                <a href="https://twitter.com/romancm" target="_blank">@romancm</a>
            </small>
        </footer> -->
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import 'firebase/firestore';
import 'firebase/auth';
import GameBoardSettings from '@/components/Settings/GameBoardSettings';
import GeneralSettings from '@/components/Settings/GeneralSettings';
import PlatformsSettings from '@/components/Settings/PlatformsSettings';
import AccountSettings from '@/components/Settings/AccountSettings';
import TagsSettings from '@/components/Settings/TagsSettings';
import Modal from '@/components/Modal/Modal';
import moment from 'moment';
import Releases from '@/components/Releases/Releases';

export default {
    components: {
        Modal,
        Releases,
        GameBoardSettings,
        GeneralSettings,
        PlatformsSettings,
        AccountSettings,
        TagsSettings,
    },

    data() {
        return {
            activeSection: null,
            activeComponent: null,
            language: null,
            reloading: false,
            localSettings: {},
            moment,
            settingsSections: [
                {
                    name: 'global',
                    icon: 'fas fa-sliders-h',
                    component: 'GeneralSettings',
                },
                {
                    name: 'tags',
                    icon: 'fas fa-tag',
                    component: 'TagsSettings',
                },
                {
                    name: 'platforms',
                    icon: 'fas fa-th',
                    component: 'PlatformsSettings',
                },
                {
                    name: 'gameBoard',
                    icon: 'fas fa-gamepad',
                    component: 'GameBoardSettings',
                },
                {
                    name: 'account',
                    icon: 'fas fa-user-cog',
                    component: 'AccountSettings',
                },
                {
                    name: 'releases',
                    icon: 'fas fa-user-cog',
                    component: 'Releases',
                },
            ],
        };
    },

    computed: {
        ...mapState(['user', 'gameLists', 'settings', 'releases', 'platform']),
        ...mapGetters(['darkModeEnabled']),

        latestRelease() {
            return this.releases && this.releases.length
                ? this.releases[0].tag_name
                : null;
        },

        dateJoined() {
            return moment(this.user.dateJoined).format('LL');
        },

        isGameBoard() {
            return this.$route.name === 'game-board';
        },

        exitUrl() {
            return process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';
        },
    },

    watch: {
        localSettings: {
            handler(oldValue, newValue) {
                if (Object.keys(newValue).length) {
                    this.save();

                    if (this.language !== newValue.language) {
                        this.reloading = true;

                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                }
            },
            deep: true,
        },
    },

    mounted() {
        this.localSettings = JSON.parse(JSON.stringify(this.settings));
        this.language = this.localSettings.language || 'en';
        this.$store.dispatch('LOAD_RELEASES');

        this.openSettings(this.settingsSections[0]);
    },

    methods: {
        openSettings({ component, name }) {
            this.activeComponent = component;
            this.activeSection = name;
        },

        exit() {
            this.$store.commit('CLEAR_SESSION');
            window.location.href = this.exitUrl;
        },

        save() {
            this.$bus.$emit('SAVE_SETTINGS', this.localSettings);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .settings {
        display: flex;
        flex-direction: column;
        padding: $gp;
        margin: 0 auto;
        min-height: 500px;
        max-width: 500px;
    }

    nav {
        display: grid;
        grid-template-columns: repeat(6, auto);
    }

    a.setting-link {
        color: $color-dark-gray;
        padding: $gp / 2;
        display: grid;
        font-size: 13px;
        cursor: pointer;
        grid-template-columns: 24px auto;

        @media($small) {
            grid-template-columns: auto;
            grid-gap: $gp / 4;
            text-align: center;
        }

        &.active {
            font-weight: bold;
            color: $color-blue;
        }
    }

    main {
        margin-top: $gp;
    }

    footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        left: 0;
        text-align: center;

        span {
            display: inline-flex;
        }
    }

    .dark {
        color: $color-dark-gray;
    }
</style>
