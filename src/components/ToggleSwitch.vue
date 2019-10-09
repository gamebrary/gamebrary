<template lang="html">
    <span class="toggle-switch">
        <p v-if="label">{{ label }}</p>

        <input
            type="checkbox"
            :id="id"
            v-model="localValue"
        />

        <label :for="id" />
    </span>
</template>

<script>
export default {
    props: {
        value: Boolean,
        id: String,
        label: String,
    },

    data() {
        return {
            localValue: null,
        };
    },

    watch: {
        value(value) {
            if (value) {
                this.localValue = JSON.parse(JSON.stringify(this.value));
            }
        },

        localValue(value) {
            this.$emit('input', value);
        },
    },

    mounted() {
        if (this.value !== undefined) {
            this.localValue = JSON.parse(JSON.stringify(this.value));
        }
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.toggle-switch {
    display: inline-flex;

    p {
        margin: 0;
        font-size: 12px;
        display: flex;
        align-items: center;
        font-weight: bold;
    }

    input[type=checkbox]{
        height: 0;
        width: 0;
        visibility: hidden;

        &:checked + label {
            background: var(--success-background);
        }

        &:checked + label:after {
            left: calc(100% - 3px);
            transform: translateX(-100%);
        }
    }

    label {
        cursor: pointer;
        text-indent: -9999px;
        width: 34px;
        height: 20px;
        background: grey;
        display: block;
        border-radius: 100px;
        position: relative;

        &:after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 14px;
            height: 14px;
            background: #fff;
            border-radius: 90px;
            transition: 0.3s;
        }
    }
}
</style>
