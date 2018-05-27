<template lang="html">
    <div class="login">
        <h2 class="page-title">Register</h2>

        <at-alert
            :message="error.statusText"
            type="error"
            v-if="error"
        />

        <form @submit.prevent="register">
            <at-input
                v-model="email"
                placeholder="Email"
            />

            <at-input
                type="password"
                v-model="password"
                placeholder="Password"
            />

            <at-button
                hollow
                native-type="submit"
                :loading="loading"
                :disabled="loading"
            >
                Login
            </at-button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            error: false,
            loading: false,
        };
    },

    mounted() {
        if (this.$store.state.user) {
            this.$router.push({ name: 'home' });
        }
    },

    methods: {
        register() {
            const payload = {
                email: this.email,
                password: this.password,
            };

            this.$store.dispatch('REGISTER', payload)
                .then(() => {
                    this.error = false;
                    this.$router.push({ name: 'home' });
                })
                .catch((error) => {
                    this.error = error;
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .login {
        @include container-xs;
    }

    h2 {
        margin-bottom: $gp * 2;
    }

</style>
