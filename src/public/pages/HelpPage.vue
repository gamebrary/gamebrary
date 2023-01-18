<template lang="html">
  <section>
    <portal to="pageTitle">
      <h3>Help</h3>
    </portal>

    <b-container class="field centered">
      <p>Feel free to contact us with any feedback, comments, suggestions, or just to say hi.</p>

      <b-button href="mailto:contact@gamebrary.com">
        <i class="fa-regular fa-envelope fa-fw" />
        contact@gamebrary.com
      </b-button>

      <p class="mt-2 small">You can also submit
        <b-link
          href="https://goo.gl/forms/r0juBCsZaUtJ03qb2"
          variant="link"
          target="_blank"
        >
          feedback anonymously
        </b-link>
      </p>

      <h3 class="mt-4">Issues</h3>
      <p>Found an issue? Submit it please.</p>

      <b-button
        id="issueReporting"
        href="https://github.com/romancm/gamebrary/issues"
        target="_blank"
      >
        <i class="fab fa-github fa-fw" /> Open a GitHub issue
      </b-button>

      <b-popover target="issueReporting" triggers="hover focus">
        <template #title>Heads up!</template>
        Contributors get featured in our GitHub repository. If you do <strong>not</strong> want to be featured, please make sure you mention it when creating issues.
      </b-popover>

      <h3 class="mt-4">Contributions</h3>

      <p>Here's a few ways you could contribute:</p>

      <ul>
        <li>Translation to other languages</li>
        <li>Design help, especially for landing page and logo</li>
        <li>Spread the word</li>
        <li>
          <b-link href="https://www.paypal.me/RomanCervantes/5">
            Donate
          </b-link>
        </li>
      </ul>

      <p class="text-center mt-5">
        We hope you enjoy Gamebrary
        <br />
        <span class="text-success">Thank you</span>
      </p>
    </b-container>
  </section>
</template>
