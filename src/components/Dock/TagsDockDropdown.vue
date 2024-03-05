<template>
  <b-dropdown
    v-if="user"
    v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
    title="Tags"
    v-bind="dockDropdownProps"
  >
    <template #button-content>
      <img
        src="/img/dock-icons/tags.png"
        alt="wikipedia"
        width="24"
      />
    </template>

    <b-dropdown-text
        v-for="({ textColor, bgColor, name }, index) in tags"
        :key="name"
        block
        class="rounded mb-1"
        :style="`background-color: ${bgColor};`"
        @click="$router.push({ name: 'tag.edit', params: { id: index } })"
      >
      <span :style="`color: ${textColor}`">{{ name }}</span>
    </b-dropdown-text>

    <!-- <b-dropdown-item
      :to="{ name: 'tags' }"
    >
    <i class="fa-regular fa-rectangle-list fa-fw"></i>
      <span class="ml-2">My tags</span>
    </b-dropdown-item> -->

    <b-dropdown-item
      v-if="user"
      :to="{ name: 'tag.create' }"
    >
      <i class="fa-regular fa-plus fa-fw" />
      <span class="ml-2">Add tag</span>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState(['user', 'tags']),
    ...mapGetters(['isVerticalNav', 'dockDropdownProps', 'darkTheme']),
  },
}
</script>

<style scoped>
/* Your component's styles here */
</style>
