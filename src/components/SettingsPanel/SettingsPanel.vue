<template lang="html">
    <md-card v-if="user && user.settings">
        <md-list class="settings-panel">
            <md-list-item>
                <md-avatar>
                    <gravatar :email="user.email" />
                </md-avatar>

                <span class="user-info">
                    <strong>{{ user.email }}</strong>
                    <br />
                    <strong>App ID</strong> {{ user._id }}
                </span>
            </md-list-item>

            <md-list-item>
                <md-icon :class="{'md-primary': nightMode }">brightness_4</md-icon>
                <span class="md-list-item-text">Night mode</span>
                <md-switch class="md-primary" v-model="nightMode" @change="save" />
            </md-list-item>

            <!-- <md-list-item>
                <md-icon :class="{'md-primary': showGameRatings }">grade</md-icon>
                <span class="md-list-item-text">Show game score</span>
                <md-switch class="md-primary" v-model="showGameRatings" @change="save" />
            </md-list-item> -->

            <!-- <md-list-item>
                <md-icon>lock</md-icon>
                <span class="md-list-item-text">Lock Columns</span>
                <md-switch class="md-primary" v-model="lockColumns" @change="save" />
            </md-list-item> -->

            <!-- <md-list-item>
                <md-icon>category</md-icon>
                <span class="md-list-item-text">Show Game Genre</span>
                <md-switch class="md-primary" v-model="showGameGenre" @change="save" />
            </md-list-item> -->

            <!-- <md-list-item>
                <md-icon>games</md-icon>
                <span class="md-list-item-text">Show player modes</span>
                <md-switch class="md-primary" v-model="showPlayerModes" @change="save" />
            </md-list-item> -->

            <!-- <md-list-item>
                <md-icon>date_range</md-icon>
                <span class="md-list-item-text">Show Release date</span>
                <md-switch class="md-primary" v-model="showReleaseDate" @change="save" />
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

            <md-list-item md-expand>
                <md-icon>settings</md-icon>
                <span class="md-list-item-text">Advanced Settings</span>

                <md-list slot="md-expand">
                    <div class="button-row">
                        <md-button
                            class="md-accent md-raised"
                            @click="promptDelete">
                            Delete Account
                        </md-button>
                    </div>
                </md-list>

                <md-dialog-confirm
                    :md-active.sync="showDeleteDialog"
                    md-title="Are you sure?"
                    md-content="All your data will be deleted FOREVER"
                    md-confirm-text="Delete account"
                    @md-confirm="deleteAccount"
                />
            </md-list-item>


            <md-divider />

            <md-list-item>
                <md-button href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" class="md-primary md-dense">
                    <md-icon>feedback</md-icon>
                    Submit feedback
                </md-button>

                <md-button href="https://github.com/romancmx/switchlist/issues" class="md-accent md-dense">
                    <md-icon>bug_report</md-icon>
                    Report issue
                </md-button>
            </md-list-item>

            <md-divider />

            <div class="button-row">
                <md-button
                    class="md-primary md-raised"
                    @click="logout"
                >
                    Log out
                </md-button>
            </div>
        </md-list>

        <md-snackbar md-position="left" :md-active.sync="showSuccess" md-persistent>
            <span>Settings saved</span>
        </md-snackbar>
    </md-card>
</template>

<script>
// import moment from 'moment';
import Gravatar from 'vue-gravatar';
import { debounce } from 'lodash';
import { Sketch } from 'vue-color';
import { mapState } from 'vuex';

export default {
    components: {
        Sketch,
        Gravatar,
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
            showDeleteDialog: false,
        };
    },

    computed: {
        ...mapState(['user']),

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
        promptDelete() {
            this.showDeleteDialog = true;
        },

        toggleDrawer() {
            this.$bus.$emit('TOGGLE_DRAWER', { panelName: null });
        },

        logout() {
            this.toggleDrawer();
            this.$store.commit('CLEAR_SESSION');
            this.$router.push({ name: 'home' });
        },

        deleteAccount() {
            // TODO: add account deleted view
            this.$store.dispatch('DELETE_USER')
                .then(() => {
                    this.logout();
                });
        },

        save: debounce(
            // eslint-disable-next-line
            function() {
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
            }, 300),

        setLocalSettings() {
            if (this.user.settings) {
                Object.keys(this.user.settings).forEach((setting) => {
                    if (this[setting] !== undefined) {
                        this[setting] = this.user.settings[setting];
                    }
                });
            }
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .settings-panel {
        min-height: 100vh
    }

    .vc-sketch {
        width: calc(100% - 18px);
        margin: 8px 0 12px;
        overflow-x: hidden;
    }

    .user-info {
        flex: 1;
    }
</style>
