<template lang="html">
    <form @submit.prevent="login" class="auth-form">
        <h3>Login</h3>
        <input type="email" ref="email" v-model="formModel.email" placeholder="Email" />
        <input type="password" v-model="formModel.password" placeholder="Password">
        <div class="checkbox">
            <span class="toggle-switch">
                <input type="checkbox" id="persist" v-model="formModel.persist" />
                <label for="persist" />
            </span>
            Keep me logged in
        </div>
        <button type="submit" class="primary" @click="login" :disabled="loading">Login</button>
    </form>
</template>

<script>
export default {
    data() {
        return {
            formModel: {
                email: '',
                password: '',
                persist: true,
            },
            loading: false,
            error: null,
        };
    },

    computed: {
        disabled() {
            return this.loading || !this.formModel.email || !this.formModel.password;
        },
    },

    mounted() {
        if (this.$store.state.user) {
            this.$router.push({ name: 'home' });
        }

        this.$refs.email.focus();
    },

    methods: {
        login() {
            if (this.disabled) {
                return;
            }

            this.loading = true;

            this.$store.dispatch('LOGIN', this.formModel)
                .then(() => {
                    this.$router.push({ name: 'home' });
                })
                .catch(() => {
                    this.loading = false;
                    this.error = true;
                });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    form {
        @include container-xs;
    }

    .toggle-switch, .checkbox {
        display: flex;
        margin-bottom: $gp;
    }

    .toggle-switch {
        margin-right: $gp / 2;
    }
</style>
