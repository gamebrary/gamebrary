<template lang="html">
    <div class="login">
        <h2 class="page-title">Login</h2>

        <at-alert :message="error" type="error" v-if="error" />

        <form @submit.prevent="login">
            <at-input v-model="email" placeholder="Email" />
            <at-input type="password" v-model="password" placeholder="Password" />

            <at-button hollow native-type="submit" :loading="loading" :disabled="disabled">
                Login
            </at-button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: 'romancm@gmail.com',
            password: 'Motorol4',
            loading: false,
            error: null,
        };
    },

    computed: {
        disabled() {
            return this.loading || !this.email || !this.password;
        },
    },

    mounted() {
        if (this.$store.state.user) {
            this.$router.push({ name: 'home' });
        }
    },

    methods: {
        login() {
            this.loading = true;

            const payload = {
                email: this.email,
                password: this.password,
            };

            this.$store.dispatch('LOGIN', payload)
                .then(() => {
                    this.error = null;
                    this.loading = false;
                    this.$router.push({ name: 'home' });
                })
                .catch(({ data }) => {
                    this.loading = false;
                    this.error = data;
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

</style>
