<template lang="html">
    <div class="login">
        <md-snackbar :md-active.sync="error">
            <span>Invalid credentials</span>
        </md-snackbar>

        <form @submit.prevent="login">
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

                    <md-checkbox
                        v-model="formModel.persist"
                        class="md-primary"
                    >
                        Keep me logged in
                    </md-checkbox>
                </md-card-content>

                <md-bottom-bar class="md-accent">
                    <md-bottom-bar-item>
                        <md-progress-spinner
                            :md-diameter="30"
                            :md-stroke="3"
                            md-mode="indeterminate"
                            v-show="loading"
                        />
                    </md-bottom-bar-item>

                    <md-bottom-bar-item md-label="Save" md-icon="save_alt" @click="login">
                        Login
                    </md-bottom-bar-item>
                </md-bottom-bar>
            </md-card>
        </form>
    </div>
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

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/variables.scss";

    .login {
        @include container-xs;
    }
</style>
