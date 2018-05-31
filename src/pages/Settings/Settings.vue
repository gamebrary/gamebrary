<template lang="html">
    <div class="profile">
        <h2>Settings</h2>
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
</style>
