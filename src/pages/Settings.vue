<template lang="html">
    <modal title="Settings">
        <button class="small primary">
            <i class="fas fa-cog" />
        </button>

        <div class="settings" slot="content">
            <!-- <pre>{{ localSettings }}</pre> -->
            <settings-global v-model="localSettings" />
            <game-board-settings v-model="localSettings" />
            <tags-settings v-model="localSettings" />
        </div>

        <settings-actions slot="footer" @save="save" />
    </modal>
</template>

<script>
import { mapState } from 'vuex';
import 'firebase/firestore';
import 'firebase/auth';
import GameBoardSettings from '@/components/Settings/GameBoardSettings';
import SettingsGlobal from '@/components/Settings/SettingsGlobal';
import SettingsActions from '@/components/Settings/SettingsActions';
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
        SettingsGlobal,
        SettingsActions,
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

    mounted() {
        this.localSettings = this.settings !== null
            ? JSON.parse(JSON.stringify(this.settings))
            : JSON.parse(JSON.stringify(this.defaultSettings));
    },

    methods: {
        save() {
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
