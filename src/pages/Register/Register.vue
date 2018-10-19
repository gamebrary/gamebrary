<template lang="html">
    <form @submit.prevent="register" class="auth-form">
        <panel class="error" v-if="error">
            There was an error creating the account
        </panel>

        <h3>Register</h3>
        <input type="email" ref="email" v-model="formModel.email" placeholder="Email" />
        <input type="password" v-model="formModel.password" placeholder="Password">

        <panel class="warning" v-if="validationError">
            Please enter a valid password
        </panel>

        <password-strength-indicator
            v-model="formModel.password"
            ref="passwordStrengthIndicator"
        />

        <button type="submit" class="primary" @click="register" :disabled="loading">
            Register
        </button>
    </form>
</template>

<script>
import PasswordStrengthIndicator from '@/components/Register/PasswordStrengthIndicator';
import Panel from '@/components/Panel/Panel';

export default {
    components: {
        PasswordStrengthIndicator,
        Panel,
    },

    data() {
        return {
            formModel: {
                email: '',
                password: '',
            },
            error: false,
            validationError: false,
            loading: false,
        };
    },

    mounted() {
        if (this.$store.state.user) {
            this.$router.push({ name: 'home' });
        }

        this.$refs.email.focus();
    },

    methods: {
        register() {
            this.validationError = false;

            if (this.loading || !this.$refs.passwordStrengthIndicator.isValid) {
                this.validationError = true;
                return;
            }

            this.loading = true;

            this.$store.dispatch('REGISTER', this.formModel)
                .then(() => {
                    this.error = false;
                    this.loading = false;
                    this.$router.push({ name: 'home' });
                })
                .catch(() => {
                    this.error = true;
                    this.loading = false;
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
</style>
