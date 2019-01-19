<template lang="html">
    <div
        :class="['toast', { show }]"
        @click="close"
    >
        <i :class="[iconName, type]" />
        <h4>{{ message }}</h4>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: '',
            type: 'success',
            timer: 2000,
            show: false,
            timeout: null,
            toastTypes: {
                success: 'fas fa-check',
                warning: 'fas fa-exclamation',
                error: 'fas fa-times',
            },
        };
    },

    computed: {
        iconName() {
            return this.toastTypes[this.type];
        },
    },

    watch: {
        show() {
            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.close();
            }, this.timer);
        },
    },

    mounted() {
        this.$bus.$on('TOAST', this.toast);
        this.$bus.$emit('TOAST', { message: 'List saved' });
    },

    beforeDestroy() {
        this.$bus.$off('TOAST');
    },

    methods: {
        toast({ message, type }) {
            this.timer = type === 'error' || type === 'warning'
                ? 5000
                : 2000;

            this.message = message || null;

            this.type = Object.keys(this.toastTypes).includes(type)
                ? type
                : 'success';

            this.show = Boolean(message);
        },

        close() {
            this.show = false;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles.scss";

.toast {
    display: flex;
    align-items: center;
    background: $color-white;
    position: fixed;
    bottom: -80px;
    right: $gp;
    cursor: pointer;
    max-width: 300px;
    opacity: 0;

    border-radius: $border-radius;
    padding: $gp;
    transition: all 200ms linear;

    h4 {
        margin: 0;
        text-transform: capitalize;
    }

    i {
        margin-right: $gp / 2;
        font-size: 20px;

        &.success {
            color: $color-green;
        }

        &.warning {
            color: $color-orange;
        }

        &.error {
            color: $color-red;
        }
    }

    &.show {
        bottom: $gp;
        opacity: 1;
        transition: all 200ms linear;
    }
}
</style>
