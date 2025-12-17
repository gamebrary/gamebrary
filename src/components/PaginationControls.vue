<template>
  <nav v-if="totalPages > 0" aria-label="Page navigation">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: currentPage === 1 || loading }">
        <button class="page-link" :class="darkTheme ? 'bg-dark text-light border-secondary' : ''"
          @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1 || loading" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>

      <template v-for="page in visiblePages" :key="page">
        <li v-if="page === '...'" class="page-item disabled">
          <span class="page-link" :class="darkTheme ? 'bg-dark text-light border-secondary' : ''">...</span>
        </li>
        <li v-else class="page-item" :class="{ active: page === currentPage, disabled: loading }">
          <button class="page-link" :class="[
            darkTheme ? 'bg-dark text-light border-secondary' : '',
            page === currentPage ? (darkTheme ? 'bg-primary' : 'bg-primary text-white') : ''
          ]" @click="$emit('page-change', page)" :disabled="loading">
            {{ page }}
          </button>
        </li>
      </template>

      <li class="page-item" :class="{ disabled: !hasMore && currentPage === totalPages || loading }">
        <button class="page-link" :class="darkTheme ? 'bg-dark text-light border-secondary' : ''"
          @click="$emit('page-change', currentPage + 1)" :disabled="(!hasMore && currentPage === totalPages) || loading"
          aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useAppGetters } from '@/stores/getters';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  hasMore: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['page-change']);

const { darkTheme } = useAppGetters();

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 7; // Show max 7 page numbers
  const current = props.currentPage;
  const total = props.totalPages;

  if (total <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (current <= 3) {
      // Near the start
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 2) {
      // Near the end
      pages.push('...');
      for (let i = total - 3; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
});
</script>

<style lang="scss" scoped>
.pagination {
  .page-link {
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>
