<template lang="html">
    <md-empty-state
        md-icon="devices_other"
        md-label="SwitchList"
        md-description="Quickly and effortlessly manage your Nintendo Switch Collection"
    >
        <router-link :to="{ name: 'register' }">
            <md-button class="md-accent md-raised">Create an account</md-button>
        </router-link>
    </md-empty-state>
</template>
