<template lang="html">
    <div class="login">
        <md-dialog-alert
            :md-active.sync="error"
            :md-content="error.statusText"
            md-confirm-text="ok"
        />

        <form @submit.prevent="register">
            <md-card>
                <md-card-header>
                    <div class="md-title">Register</div>
                </md-card-header>

                <md-card-content>
                    <md-field>
                        <label>Email</label>
                        <md-input type="email" v-model="email"></md-input>
                    </md-field>

                    <md-field>
                        <label>Password</label>
                        <md-input type="password" v-model="password"></md-input>
                    </md-field>
                </md-card-content>

                <md-card-actions>
                    <md-button type="submit" class="md-primary" :disabled="loading">
                        Create account
                    </md-button>
                </md-card-actions>
            </md-card>
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
