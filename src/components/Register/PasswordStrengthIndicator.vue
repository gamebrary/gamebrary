<template lang="html">
    <div class="password-strength-indicator" v-if="value">
        <h4>Password requirements:</h4>

        <span :class="{ valid: meetsLength }">
            <md-icon v-if="meetsLength">verified_user</md-icon>
            <md-icon v-else>highlight_off</md-icon>
            8 Character minimum
        </span>

        <span :class="{ valid: hasNumber }">
            <md-icon v-if="hasNumber">verified_user</md-icon>
            <md-icon v-else>highlight_off</md-icon>
            At least one number
        </span>

        <span :class="{ valid: hasUppercase }">
            <md-icon v-if="hasUppercase">verified_user</md-icon>
            <md-icon v-else>highlight_off</md-icon>
            At least one uppercase letter
        </span>

        <span :class="{ valid: hasLowercase }">
            <md-icon v-if="hasLowercase">verified_user</md-icon>
            <md-icon v-else>highlight_off</md-icon>
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
    @import "~styles/variables.scss";

    .password-strength-indicator {
        display: flex;
        flex-direction: column;

        span {
            --md-theme-default-icon-on-background: $nin-red;
            color: $nin-red;

            &.valid {
                --md-theme-default-icon-on-background: $zelda-green;
                color: $zelda-green;
            }
        }
    }
</style>
