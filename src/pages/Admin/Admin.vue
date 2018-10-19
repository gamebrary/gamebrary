<template lang="html">
    <div class="admin">
        <div class="loading" v-if="!adminData">
            <i class="fas fa-circle-notch fast-spin fa-3x" />
        </div>

        <div v-else>
            <header class="stats">
                <strong>{{ adminData.length }} Users</strong>

                <button class="primary" @click="load">
                    <i class="fas fa-sync" />
                    Reload data
                </button>
            </header>

            <div class="users">
                <div class="user">
                    <strong>Avatar</strong>
                    <strong>Email</strong>
                    <strong>Lists</strong>
                    <strong>Game count</strong>
                    <strong>Joined</strong>
                    <strong>View</strong>
                </div>

                <div class="user" v-for="user in adminData" :key="user._id">
                    <gravatar :email="user.email" />

                    {{ user.email }}

                    <div class="lists">
                        <!-- {{ user.lists.length }} -->
                        {{ getListNames(user.lists) }}
                    </div>

                    <span>
                        {{ getGameCount(user.lists) }}
                    </span>

                    <span :title="moment(user.dateJoined).format('LL')">
                        {{ moment(user.dateJoined).fromNow() }}
                    </span>

                    <router-link
                        tag="button"
                        class="small info"
                        :to="{ name: 'share', params: { id: user._id }}"
                    >
                        <i class="fas fa-link"></i>
                        View
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Gravatar from 'vue-gravatar';
import moment from 'moment';
import toasts from '@/mixins/toasts';

export default {
    components: {
        Gravatar,
    },

    mixins: [toasts],

    data() {
        return {
            moment,
            users: null,
            error: false,
        };
    },

    computed: {
        ...mapState(['user', 'adminData']),
    },

    mounted() {
        if (!this.adminData) {
            this.load();
        }
    },

    methods: {
        getListNames(lists) {
            return lists.map(({ name }) => name).join(', ');
        },

        getGameCount(lists) {
            return lists.map(({ games }) => games.length).reduce((a, b) => a + b, 0);
        },

        load() {
            if (this.user.admin) {
                this.$store.dispatch('LOAD_USERS').catch(this.exit);
            } else {
                this.exit();
            }
        },

        exit() {
            this.$error('Admins only, sorry!');
            this.$router.push({ name: 'home' });
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.loading {
    height: calc(100vh - 48px);
    color: $color-dark-gray;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stats {
    padding: $gp;
    display: flex;
    align-items: center;
    justify-content: space-between;

    strong {
        font-size: 24px;
        color: $color-light-gray;
    }
}

.users {
    display: flex;
    flex-direction: column;
    overflow-x: auto;

    .user {
        padding: $gp / 3 $gp;
        display: grid;
        grid-template-columns: 50px 240px 300px 100px 120px 120px 120px;
        grid-gap: 10px;
        align-items: center;

        &:hover {
            background: $color-light-gray;
        }

        img {
            width: 50px;
        }
    }
}
</style>
