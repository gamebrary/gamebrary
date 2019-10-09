<template lang="html">
    <modal title="Settings">
        <button class="small primary">
            <i class="fas fa-cog" />
        </button>

        <div class="settings" slot="content">
            <general-settings v-model="localSettings" :reloading="reloading" />
            <game-board-settings v-model="localSettings" :reloading="reloading" />
            <platforms-settings v-model="localSettings" :reloading="reloading" />
            <tags-settings v-model="localSettings" :reloading="reloading" />
            <account-settings v-model="localSettings" :reloading="reloading" />
        </div>
    </modal>
</template>

<script>
import { mapState } from 'vuex';
import 'firebase/firestore';
import 'firebase/auth';
import GameBoardSettings from '@/components/Settings/GameBoardSettings';
import GeneralSettings from '@/components/Settings/GeneralSettings';
import PlatformsSettings from '@/components/Settings/PlatformsSettings';
import AccountSettings from '@/components/Settings/AccountSettings';
import AboutSettings from '@/components/Settings/AboutSettings';
import TagsSettings from '@/components/Settings/TagsSettings';
import Modal from '@/components/Modal';
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
        AboutSettings,
        TagsSettings,
    },

    data() {
        return {
            activeSection: null,
            activeComponent: null,
            language: null,
            reloading: false,
            localSettings: null,
            moment,
            defaultSettings: {
                language: 'en',
                theme: {
                    global: 'theme-default',
                },
            },
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
                    icon: 'fas fa-gamepad',
                    component: 'PlatformsSettings',
                },
                {
                    name: 'gameBoard',
                    icon: 'fab fa-trello',
                    component: 'GameBoardSettings',
                },
                {
                    name: 'account',
                    icon: 'fas fa-user',
                    component: 'AccountSettings',
                },
                {
                    name: 'releases',
                    icon: 'fas fa-rocket',
                    component: 'Releases',
                },
                {
                    name: 'about',
                    icon: 'fas fa-info',
                    component: 'AboutSettings',
                },
            ],
        };
    },

    computed: {
        ...mapState(['user', 'gameLists', 'settings', 'platform']),

        dateJoined() {
            return moment(this.user.dateJoined).format('LL');
        },

        isGameBoard() {
            return this.$route.name === 'game-board';
        },
    },

    watch: {
        localSettings: {
            handler(oldValue, newValue) {
                if (newValue && Object.keys(newValue).length) {
                    this.save();

                    if (newValue
                            && newValue.language !== undefined
                            && this.language !== newValue.language
                    ) {
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
        this.localSettings = this.settings !== null
            ? JSON.parse(JSON.stringify(this.settings))
            : JSON.parse(JSON.stringify(this.defaultSettings));
    },

    methods: {
        save() {
            // TODO: call action directly
            this.$bus.$emit('SAVE_SETTINGS', this.localSettings);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles";

    .settings {
        display: flex;
        flex-direction: column;
        padding: $gp * 2 $gp;
        margin: 0 auto;
        min-height: 600px;
    }
</style>
