<template lang="html">
    <md-empty-state
        md-icon="devices_other"
        md-label="SwitchList"
        md-description="Quickly and effortlessly manage your Nintendo Switch Collection"
    >
        <router-link :to="{ name: 'register' }">
            <md-button class="md-accent md-raised">Create an account</md-button>
        </router-link>

        <md-button class="md-raised">Default</md-button>
        <md-button class="md-raised md-primary">Primary</md-button>
        <md-button class="md-raised md-accent">Accent</md-button>
        <md-button class="md-raised" disabled>Disabled</md-button>
        <md-button>Default</md-button>
        <md-button class="md-primary">Primary</md-button>
        <md-button class="md-accent">Accent</md-button>
        <md-button disabled>Disabled</md-button>
    </md-empty-state>
</template>
