<template lang="html">
    <div
        :class="['toast', type, { show, 'has-image': imageUrl }]"
        @click="close"
    >
        <img :src="imageUrl" />
        <i :class="[iconName]" />
        <h4>{{ message }}</h4>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: '',
            imageUrl: null,
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
    },

    beforeDestroy() {
        this.$bus.$off('TOAST');
    },

    methods: {
        toast({ message, type, imageUrl }) {
            this.timer = type === 'error'
                ? 5000
                : 2000;

            this.message = message || null;
            this.imageUrl = imageUrl || null;

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
@import "~styles/styles";

.toast {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: -80px;
    right: $gp;
    cursor: pointer;
    max-width: 300px;
    opacity: 0;
    z-index: 1;
    border-radius: $border-radius;
    padding: $gp;
    transition: all 200ms linear;

    &.success {
        background: var(--success-background);
        color: var(--success-text-color);
    }

    &.error {
        background: var(--danger-background);
        color: var(--danger-text-color);
    }

    &.has-image {
        padding: $gp / 3;
        max-width: 240px;

        h4 {
            font-size: 12px;
        }

        img {
            margin-right: $gp / 2;
            max-width: 50px;
            max-height: 50px;
        }
    }

    i {
        margin-right: $gp / 2;
        font-size: 20px;
    }

    &.show {
        bottom: $gp;
        opacity: 1;
        transition: all 200ms linear;
    }
}
</style>
