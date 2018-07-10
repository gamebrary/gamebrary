<template lang="html">
    <form @submit.prevent="register" class="auth-form">
        <md-snackbar :md-active.sync="error">
            <span>There was an error creating the account</span>
        </md-snackbar>

        <md-snackbar :md-active.sync="validationError">
            <span>Please enter a valid password</span>
        </md-snackbar>

        <md-card>
            <md-card-header>
                <div class="md-title">Register</div>
            </md-card-header>

            <md-card-content>
                <md-field>
                    <label>Email</label>
                    <md-input type="email" v-model="formModel.email" />
                </md-field>

                <md-field>
                    <label>Password</label>
                    <md-input type="password" v-model="formModel.password" />
                </md-field>

                <password-strength-indicator
                    v-model="formModel.password"
                    ref="passwordStrengthIndicator"
                />

                <md-button type="submit" style="display: none;" />
            </md-card-content>

            <div class="button-row">
                <md-button class="md-button md-primary" disabled>
                    <md-progress-spinner
                        :md-diameter="30"
                        :md-stroke="3"
                        class="md-primary"
                        md-mode="indeterminate"
                        v-show="loading"
                    />
                </md-button>

                <md-button
                    class="md-primary md-raised"
                    @click="register"
                    :disabled="loading"
                >
                    Register
                </md-button>
            </div>
        </md-card>
    </form>
</template>

<script>
import PasswordStrengthIndicator from '@/components/Register/PasswordStrengthIndicator';

export default {
    components: {
        PasswordStrengthIndicator,
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
    },

    methods: {
        register() {
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
