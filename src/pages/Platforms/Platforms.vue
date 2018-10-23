<template lang="html">
    <div class="platforms">
        <pre>{{ gameLists }}</pre>
        <a
            v-close-popover
            v-for="platform in platforms"
            :key="platform.name"
            @click="changePlatform(platform)"
        >
            {{ platform.name }}
            <br>
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
        ...mapState(['gameLists']),
    },

    mounted() {
        if (Object.keys(this.gameLists).length === 1) {
            console.log('auto select');
            this.changePlatform(this.platforms[Object.keys(this.gameLists)[0]]);
        }
        // console.log(this.gameLists);
        // console.log(this.platforms);
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

    .platforms {
        display: grid;
        display: grid;
        grid-template-columns: 100px 100px 100px;
        grid-gap: 10px;

    }
</style>
