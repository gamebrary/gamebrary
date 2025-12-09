<template lang="html">
  <div class="small-container">
    <portal to="pageTitle">Help</portal>
    <h3 class="mt-4">Contact</h3>
    <p>Feel free to contact us with any feedback, comments, suggestions, or just to say hi.</p>

    <a href="mailto:contact@gamebrary.com" class="btn btn-primary">
      <i class="fa-regular fa-envelope fa-fw" />
      contact@gamebrary.com
    </a>

    <p class="mt-2">You can also submit
      <a
        href="https://goo.gl/forms/r0juBCsZaUtJ03qb2"
        class="link-primary"
        target="_blank"
      >
        feedback anonymously
      </a>
    </p>

    <h3 class="mt-4">Issues</h3>
    <p>Found an issue? Submit it please.</p>

    <a
      id="issueReporting"
      href="https://github.com/romancm/gamebrary/issues"
      target="_blank"
      class="btn btn-primary"
      data-bs-toggle="popover"
      data-bs-trigger="hover focus"
      data-bs-title="Heads up!"
      data-bs-content="Contributors get featured in our GitHub repository. If you do not want to be featured, please make sure you mention it when creating issues."
    >
      <i class="fab fa-github fa-fw" /> Open a GitHub issue
    </a>

    <h3 class="mt-4">Legal</h3>
    <router-link :to="{ name: 'privacy.policy' }" class="link-primary">
      Privacy Policy
    </router-link>

    <br />

    <router-link :to="{ name: 'terms' }" class="link-primary">
      Terms
    </router-link>

    <h3 class="mt-4">Contributions</h3>

    <p>Here's a few ways you could contribute:</p>

    <ul>
      <li>Translation to other languages</li>
      <li>Design help, especially for landing page and logo</li>
      <li>Spread the word</li>
      <li>
        <a href="https://www.paypal.me/RomanCervantes/5" class="link-primary">
          Donate
        </a>
      </li>
    </ul>

    <p class="text-center mt-5">
      We hope you enjoy Gamebrary
      <br />
      <span class="text-success">Thank you</span>
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    this.initPopovers();
  },

  updated() {
    this.initPopovers();
  },

  methods: {
    initPopovers() {
      this.$nextTick(() => {
        const popoverTriggerList = this.$el.querySelectorAll('[data-bs-toggle="popover"]');
        popoverTriggerList.forEach(popoverTriggerEl => {
          if (!popoverTriggerEl._popover) {
            new bootstrap.Popover(popoverTriggerEl);
          }
        });
      });
    },
  },
};
</script>
