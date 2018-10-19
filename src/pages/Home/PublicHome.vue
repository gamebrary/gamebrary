<template lang="html">
    <div class="home">
        <h1>GAMEBRARY</h1>

        <strong>500+ users! Thank you!</strong>

        <p>A simple and user friendly way to manage your video game collection.</p>

        <div class="actions">
            <router-link tag="button" class="primary" :to="{ name: 'register' }">
                Create an account
            </router-link>

            <router-link tag="button" class="info" :to="{ name: 'login' }">
                Login
            </router-link>
        </div>
    </div>
</template>

<script>
import Panel from '@/components/Panel/Panel';

export default {
    components: {
        Panel,
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .home {
        @include container-xs;
    }

    .actions {
        display: flex;
        align-items: center;
        margin-bottom: $gp;
        border-bottom: 1px solid $color-light-gray;
        padding-bottom: $gp;

        .info {
            margin-left: $gp;
        }
    }

    strong {
        color: $color-green;
    }
</style>
