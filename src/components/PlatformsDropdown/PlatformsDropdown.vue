<template lang="html">
    <div class="platform-switcher">
        <router-link :to="{ name: 'home' }" v-if="platform">
            {{ platform.name }}
        </router-link>

        <v-popover>
            <i class="fas fa-caret-down dropdown" />

            <template slot="popover">
                <div class="platforms">
                    <a
                        v-close-popover
                        v-for="platform in platforms"
                        :key="platform.name"
                        @click="changePlatform(platform)"
                    >
                        {{ platform.name }}
                    </a>
                </div>
            </template>
        </v-popover>
    </div>
</template>

<script>
import { mapState } from 'vuex';
// eslint-disable-next-line
import platforms from '@/platforms';

export default {
    data() {
        return {
            platforms,
        };
    },

    computed: {
        ...mapState(['platform', 'user']),
    },

    methods: {
        changePlatform(platform) {
            this.$store.commit('SET_PLATFORM', platform);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .platform-switcher {
        display: flex;
        align-items: center;
        margin: 0 $gp;
        color: $color-white;

        > a {
            color: $color-white;
            text-decoration: none;
        }
    }

    .platforms {
        background: $color-white;
        border: 4px solid $color-dark-gray;
        border-top: 0;
        position: fixed;
        left: 0;
        width: 200px;
        height: 300px;
        overflow: auto;
        overflow: overlay;

        a {
            display: flex;
            align-items: center;
            padding: $gp / 2;
        }
    }

    .dropdown {
        padding: $gp / 2;
    }
</style>
