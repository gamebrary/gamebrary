<template lang="html">
    <div class="edit-list">
        <form @submit.prevent="addList" v-if="show">
            <input
                v-model="newListName"
                type="text"
                ref="newListName"
                required
                :placeholder="$t('list.name')"
            />

            <panel
                class="warning"
                v-if="isDuplicate"
                v-html="errorMessage"
            />

            <div>
                <button
                    type="submit"
                    class="small primary"
                    v-if="!isDuplicate"
                    :disabled="!newListName.length"
                >
                    {{ $t('global.create') }}
                </button>

                <button
                    class="small info hollow"
                    type="button"
                    v-if="list"
                    @click="reset"
                >
                    {{ $t('global.cancel') }}
                </button>
            </div>
        </form>

        <div class="actions" v-else>
            <button
                class="small info"
                :title="$t('list.add')"
                @click="toggleAddList"
            >
                <i class="fas fa-plus" />
            </button>

            <button
                class="small info"
                :title="$t('list.add')"
                @click="promptDeletePlatform"
            >
                <i class="far fa-trash-alt" />
            </button>

            <button
                class="small info"
                @click="showShareModal"
                title="Share"
            >
                <i class="fas fa-share-alt" />
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { swal } from '@/shared/modals';
import Panel from '@/components/Panel/Panel';

export default {
    components: {
        Panel,
    },

    data() {
        return {
            show: false,
            newListName: '',
        };
    },

    computed: {
        ...mapState(['user', 'gameLists', 'platform']),

        errorMessage() {
            return `You already have a list named <strong>${this.newListName}</strong>. Please use a different name.`;
        },

        list() {
            return this.gameLists[this.platform.code];
        },

        isDuplicate() {
            const newListName = this.newListName.toLowerCase();
            // eslint-disable-next-line
            return this.list ?
                this.list.filter(({ name }) => name.toLowerCase() === newListName).length > 0
                : false;
        },

        shareUrl() {
            const url = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://gamebrary.com';

            return `${url}/#/s/${this.user.uid}/${this.platform.code}`;
        },
    },

    watch: {
        show() {
            this.$nextTick(() => {
                if (this.$refs.newListName) {
                    this.$refs.newListName.focus();
                }
            });
        },
    },

    mounted() {
        if (!this.list) {
            this.toggleAddList();
        }
    },

    methods: {
        toggleAddList() {
            if (!this.show) {
                this.$nextTick(() => {
                    this.$emit('scroll');
                });
            }

            this.show = !this.show;
        },

        showShareModal() {
            swal({
                titleText: 'Share your list',
                html: 'Use the following URL to share this list.',
                input: 'url',
                inputValue: this.shareUrl,
                showConfirmButton: false,
            });
        },

        promptDeletePlatform() {
            swal({
                title: 'Are you sure?',
                text: `Your ${this.platform.name} collection will be deleted forever.`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'error',
                cancelButtonClass: 'accent',
                buttonsStyling: false,
                confirmButtonText: `Yes, delete ${this.platform.name} collection`,
            }).then(({ value }) => {
                if (value) {
                    this.$store.commit('REMOVE_PLATFORM');
                    this.$router.push({ name: 'platforms' });
                    this.$emit('update', true);
                }
            });
        },

        addList() {
            this.$store.commit('ADD_LIST', this.newListName);

            this.$ga.event({
                eventCategory: 'list',
                eventAction: 'add',
                eventLabel: 'listAdded',
                eventValue: this.newListName,
            });

            this.$emit('update');
            this.$emit('scroll');
            this.reset();

            this.$bus.$emit('TOAST', { message: 'List added' });
        },

        reset() {
            this.show = false;
            this.newListName = '';
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .edit-list {
        padding-right: $gp;
    }

    form {
        border-radius: $border-radius;
        background: $color-light-gray;
        padding: $gp / 2;
        display: flex;
        flex-direction: column;

        input {
            width: 284px;

            @media($small) {
                width: 200px;
            }
        }
    }

    .actions {
        display: grid;
        grid-gap: $gp;
        align-items: center;
        flex-direction: column;
    }

    .panel.warning {
        margin: 0 0 $gp;
    }

    small {
        background: $color-white;
        margin-bottom: $gp / 2;
        display: block;
        padding: $gp / 2;
        border-radius: $border-radius;
    }
</style>

<style lang="scss" rel="stylesheet/scss">
    .swal2-input {
        font-size: 10px !important;
    }
</style>
