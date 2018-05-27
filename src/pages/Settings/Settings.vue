<!-- WIP -->
<!-- TODO: hook up to endpoint -->
<!-- TODO: rename this file to settings -->
<template lang="html">
    <div class="profile">
        <h2>Settings</h2>
        <hr>
        <!-- <p>Email: {{ user.email }}</p> -->
        <!-- <p>Joined: {{ dateJoined }}</p> -->
        <!-- <p>Lists: {{ user.lists.length }}</p> -->
        <!-- Lock columns
        <at-switch
            v-model="localSettings.lockColumns"
            @change="localSettings.lockColumns = !localSettings.lockColumns"
        /> -->

        <!-- Dark mode (overrides background) -->
        <!-- <at-switch
            v-model="localSettings.darkMode"
            @change="localSettings.darkMode = !localSettings.darkMode"
        /> -->

        <!-- View
        <at-button-group>
          <at-button>Text only</at-button>
          <at-button>Cover only</at-button>
          <at-button>Cover and Text</at-button>
          <at-button>Game icon</at-button>
        </at-button-group> -->

        <!-- <sketch v-model="settings.backgroundColor" /> -->

        <!-- <hr>
        Shareable link
        <at-input v-model="shareUrl" readonly />
        <hr> -->

        <!-- <at-button hollow @click="logout">Logout</at-button> -->
    </div>
</template>

<script>
import moment from 'moment';
import { Sketch } from 'vue-color';

export default {
    components: {
        Sketch,
    },

    data() {
        return {
            localSettings: null,
        };
    },

    computed: {
        user() {
            return this.$store.state.user;
        },

        settings() {
            return this.$store.state.user.settings;
        },

        dateJoined() {
            return moment(this.user.dateJoined).fromNow();
        },

        shareUrl() {
            // eslint-disable-next-line
            return `http://switchlist.io/share/${this.user._id}`;
        },
    },

    mounted() {
        this.localSettings = JSON.parse(JSON.stringify(this.settings));
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .profile {
        @include container-xs;
    }

    .charts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
        background-color: #fff;
        color: #444;
    }
</style>
