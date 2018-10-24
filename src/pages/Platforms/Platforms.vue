<!-- TODO: make this look half way decent -->
<template lang="html">
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

<script>
// eslint-disable-next-line
import platforms from '@/platforms';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            platforms,
        };
    },

    computed: {
        ...mapState(['gameLists', 'platform']),
    },

    mounted() {
        if (this.gameLists && Object.keys(this.gameLists).length === 1) {
            this.changePlatform(this.platforms[Object.keys(this.gameLists)[0]]);
        }
    },

    methods: {
        changePlatform(platform) {
            this.$store.commit('SET_PLATFORM', platform);
            this.$router.push({ name: 'home' });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .platforms {
        display: grid;
        grid-template-columns: 100px 100px 100px;
        grid-gap: 10px;
        text-align: center;

        a {
            height: 100px;
            display: flex;
            align-items: center;
        }

    }
</style>
