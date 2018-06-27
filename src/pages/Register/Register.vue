<template lang="html">
    <div class="login">
        <md-snackbar :md-active.sync="error">
            <span>There was an error creating the account</span>
        </md-snackbar>

        <form @submit.prevent="register">
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

                    <md-button type="submit" style="display: none;" />
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

                    <md-bottom-bar-item md-label="Save" md-icon="save_alt" @click="register">
                        Create Account
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
            },
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
            if (this.loading) {
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
    @import "~styles/variables.scss";

    .login {
        @include container-xs;
    }

    h2 {
        margin-bottom: $gp * 2;
    }

</style>
