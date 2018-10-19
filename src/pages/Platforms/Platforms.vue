<template lang="html">
    <div>
        <div class="platforms">
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
    </div>
</template>

<script>
// eslint-disable-next-line
import platforms from '@/platforms';

export default {
    data() {
        return {
            platforms,
        };
    },

    methods: {
        changePlatform(platform) {
            this.$store.commit('SET_PLATFORM', platform);
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
