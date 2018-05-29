<template lang="html">
    <div class="login">
        <md-dialog-alert :md-active.sync="error" :md-content="error" md-confirm-text="ok" />

        <form @submit.prevent="login">
            <md-card>
                <md-card-header>
                    <div class="md-title">Login</div>
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
                    <md-button type="submit" class="md-primary" :disabled="disabled">
                        Login
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

    // .md-content {
    //     padding: $gp;
    //     margin-bottom: $gp;
    //     border-radius: $border-radius;
    // }

</style>
