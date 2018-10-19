<template lang="html">
    <div class="password-strength-indicator" v-if="value">
        <h4>Password requirements:</h4>

        <span :class="{ valid: meetsLength }">
            <i class="far fa-check-square" v-if="meetsLength"/>
            <i class="far fa-square" v-else />
            8 Character minimum
        </span>

        <span :class="{ valid: hasNumber }">
            <i class="far fa-check-square" v-if="hasNumber"/>
            <i class="far fa-square" v-else />
            At least one number
        </span>

        <span :class="{ valid: hasUppercase }">
            <i class="far fa-check-square" v-if="hasUppercase"/>
            <i class="far fa-square" v-else />
            At least one uppercase letter
        </span>

        <span :class="{ valid: hasLowercase }">
            <i class="far fa-check-square" v-if="hasLowercase"/>
            <i class="far fa-square" v-else />
            At least one lowercase letter
        </span>
    </div>
</template>

<script>
export default {
    props: {
        value: String,
    },

    computed: {
        meetsLength() {
            return this.value && this.value.length > 7;
        },

        hasNumber() {
            return /\d/.test(this.value);
        },

        hasUppercase() {
            return (/[A-Z]/.test(this.value));
        },

        hasLowercase() {
            return (/[a-z]/.test(this.value));
        },

        isValid() {
            const { meetsLength, hasNumber, hasUppercase, hasLowercase } = this;
            return meetsLength && hasNumber && hasUppercase && hasLowercase;
        },
    },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "~styles/styles.scss";

    .password-strength-indicator {
        display: flex;
        flex-direction: column;

        span {
            color: $color-red;

            &.valid {
                color: $color-green;
            }
        }
    }
</style>
