<template lang="html">
    <div class="profile">
        <form @submit.prevent="save">
            <md-card>
                <md-card-header>
                    <div class="md-title">Settings</div>
                </md-card-header>

                <md-card-content>
                    <!-- <section>
                        <md-switch v-model="lockColumns" />
                        <span>Lock Columns</span>
                    </section> -->

                    <section>
                        <md-switch v-model="nightMode" />
                        <span>Night mode</span>
                    </section>

                    <section>
                        <md-switch v-model="showGameRatings" />
                        <span>Show game score</span>
                    </section>

                    <!-- <section>
                        <md-switch v-model="showGameGenre" />
                        <span>Show Game Genre</span>
                    </section> -->

                    <!-- <section>
                        <md-switch v-model="showPlayerModes" />
                        <span>Show player modes</span>
                    </section> -->

                    <!-- <section>
                        <md-switch v-model="showReleaseDate" />
                        <span>Show Release date</span>
                    </section> -->

                    <!-- <section class="column">
                        <span>Game view</span>
                        <span>
                            <md-radio v-model="cardView" value="cover">Cover and text</md-radio>
                            <md-radio v-model="cardView" value="text">Text only</md-radio>
                        </span>
                    </section> -->

                    <section>
                        <md-button
                            class="md-icon-button color-picker md-dense"
                            :style="{ background: backgroundColor.hex || backgroundColor }"
                            :md-backdrop="false"
                            @click="showDialog = !showDialog"
                        >
                          <md-icon>format_color_fill</md-icon>
                        </md-button>
                        <span>Background color</span>
                    </section>

                    <md-dialog :md-active.sync="showDialog">
                        <md-dialog-title>Choose background color</md-dialog-title>
                        <sketch v-model="backgroundColor" />

                        <md-dialog-actions>
                            <md-button class="md-primary" @click="showDialog = false">OK</md-button>
                        </md-dialog-actions>
                    </md-dialog>

                </md-card-content>

                <md-card-actions>
                    <md-button type="submit" class="md-primary">
                        Save
                    </md-button>

                    <md-snackbar md-position="left" :md-active.sync="showSuccess" md-persistent>
                        <span>Settings saved</span>
                    </md-snackbar>

                </md-card-actions>
            </md-card>
        </form>
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

        dateJoined() {
            return moment(this.user.dateJoined).fromNow();
        },

        shareUrl() {
            // eslint-disable-next-line
            return `http://switchlist.io/share/${this.user._id}`;
        },
    },

    mounted() {
        this.setLocalSettings();
    },

    methods: {
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
    @import "~styles/variables.scss";

    .profile {
        @include container-xs;
        margin: $gp * 2 auto;
    }

    .vc-sketch {
        margin: 0 auto;
    }

    section {
        display: flex;
        align-items: center;
        margin: $gp 0;

        &.column {
            flex-direction: column;
            align-items: flex-start;
        }

        .color-picker, .md-switch {
            margin: 0 $gp 0 0;
        }

        .md-radio {
            margin: $gp / 2 $gp 0 0;
        }
    }
</style>
