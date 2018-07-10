<template lang="html">
    <form @submit.prevent="login" class="auth-form">
        <md-snackbar :md-active.sync="error">
            <span>Invalid credentials</span>
        </md-snackbar>

        <md-card>
            <md-card-header>
                <div class="md-title">Login</div>
            </md-card-header>

            <md-card-content>
                <md-field>
                    <label>Email</label>

                    <md-input
                        type="email"
                        v-model="formModel.email"
                    />
                </md-field>

                <md-field>
                    <label>Password</label>

                    <md-input
                        type="password"
                        v-model="formModel.password"
                    />
                </md-field>

                <md-checkbox v-model="formModel.persist" class="md-primary">
                    Keep me logged in
                </md-checkbox>

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
                    @click="login"
                    :disabled="loading"
                >
                    Login
                </md-button>
            </div>
        </md-card>
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
