<template lang="html">
    <div>
        <md-list>
            <md-subheader>Settings</md-subheader>

            <md-list-item>
                <md-icon>brightness_4</md-icon>
                <span class="md-list-item-text">Night mode</span>
                <md-switch v-model="nightMode" @change="save" />
            </md-list-item>

            <md-list-item>
                <md-icon>grade</md-icon>
                <span class="md-list-item-text">Show game score</span>
                <md-switch v-model="showGameRatings" @change="save" />
            </md-list-item>

            <!-- <md-list-item>
                <md-icon>lock</md-icon>
                <span class="md-list-item-text">Lock Columns</span>
                <md-switch v-model="lockColumns" @change="save" />
            </md-list-item> -->

            <!-- <md-list-item>
                <md-icon>category</md-icon>
                <span class="md-list-item-text">Show Game Genre</span>
                <md-switch v-model="showGameGenre" @change="save" />
            </md-list-item> -->

            <!-- <md-list-item>
                <md-icon>games</md-icon>
                <span class="md-list-item-text">Show player modes</span>
                <md-switch v-model="showPlayerModes" @change="save" />
            </md-list-item> -->

            <!-- <md-list-item>
                <md-icon>date_range</md-icon>
                <span class="md-list-item-text">Show Release date</span>
                <md-switch v-model="showReleaseDate" @change="save" />
            </md-list-item> -->

            <!-- <md-list-item>
                <md-icon>vertical_split</md-icon>
                <span class="md-list-item-text">List layout</span>
                <span>
                    <md-radio v-model="cardView" value="cover">Cover and text</md-radio>
                    <md-radio v-model="cardView" value="text">Text only</md-radio>
                </span>
            </md-list-item> -->

            <md-list-item md-expand>
                <md-icon>format_color_fill</md-icon>
                <span class="md-list-item-text">Background color</span>

                <md-list slot="md-expand">
                    <md-list-item>
                        <sketch
                            v-model="backgroundColor"
                            @input="save"
                        />
                    </md-list-item>
                </md-list>
            </md-list-item>

            <md-divider />

            <md-list-item>
                <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
                    <md-icon>feedback</md-icon>
                    Submit feedback
                </a>
            </md-list-item>
        </md-list>

        <md-bottom-bar>
            <md-bottom-bar-item md-label="Log out" md-icon="exit_to_app" @click="logout" />
            <md-bottom-bar-item md-label="Close" md-icon="close" @click="toggleDrawer" />
        </md-bottom-bar>

        <md-snackbar md-position="left" :md-active.sync="showSuccess" md-persistent>
            <span>Settings saved</span>
        </md-snackbar>
    </div>
</template>

<script>
// import moment from 'moment';
import { Sketch } from 'vue-color';

export default {
    components: {
        Sketch,
    },

    data() {
        return {
            lockColumns: false,
            nightMode: false,
            cardView: null,
            showGameRatings: false,
            showGameGenre: false,
            showPlayerModes: false,
            showReleaseDate: false,
            backgroundColor: '#a5a2a2',
            showDialog: false,
            showSuccess: false,
        };
    },

    computed: {
        user() {
            return this.$store.state.user;
        },

        settings() {
            return this.$store.state.user.settings;
        },

        // dateJoined() {
        //     return moment(this.user.dateJoined).fromNow();
        // },

        // shareUrl() {
        //     // eslint-disable-next-line
        //     return `http://switchlist.io/share/${this.user._id}`;
        // },
    },

    mounted() {
        this.setLocalSettings();
    },

    methods: {
        toggleDrawer() {
            this.$bus.$emit('TOGGLE_DRAWER');
        },

        logout() {
            this.$bus.$emit('TOGGLE_DRAWER');
            this.$store.commit('CLEAR_SESSION');
            this.$router.push({ name: 'home' });
        },

        save() {
            const payload = {
                lockColumns: this.lockColumns,
                showGameRatings: this.showGameRatings,
                // showGameGenre: this.showGameGenre,
                // showPlayerModes: this.showPlayerModes,
                // showReleaseDate: this.showReleaseDate,
                nightMode: this.nightMode,
                // cardView: this.cardView,
                backgroundColor: this.backgroundColor.hex || this.backgroundColor,
            };

            this.$store.dispatch('UPDATE_SETTINGS', payload)
                .then(() => {
                    this.showSuccess = true;
                });
        },

        setLocalSettings() {
            Object.keys(this.settings).forEach((setting) => {
                if (this[setting] !== undefined) {
                    this[setting] = this.settings[setting];
                }
            });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .md-bottom-bar {
        position: absolute;
        bottom: 0;
    }
</style>
